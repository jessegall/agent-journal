import time
from dataclasses import dataclass
from pathlib import Path
from typing import ClassVar

from engine import bus
from engine.events.agents import AgentReported, ToolFinished
from engine.events.engine import ClockTicked, FileEdited
from engine.events.resources import AnyEvent, ResourceEvent, TodoCompleted, WorkCreated
from features import trigger
from features.sending import Sent
from features.trigger import MINUTE
from providers.payload import HookEvent
from features.parts import WHOLE_FEATURE, AgentContext, Context, Handler
from features.work_tracking import tracker
from engine.transcript import IDLE
from features.work_tracking.next import carried_on, named_rows, questioned, ready, waiting_rows
from providers import PROVIDERS
from resources.types import Work
from engine.command_runs import command_runs
from controllers.types import Agents, Messages, Todos, Works
from features.work_tracking.auto import automatic
from resources.base import SYSTEM, USER

ASKED_AGAIN_AFTER = 60
NAMED_PARKED = "named_parked"


@dataclass(frozen=True)
class WorkCompleted(ResourceEvent):
    on: ClassVar[str] = "work.completed"
    todo: bool = False

    @classmethod
    def read(cls, event) -> "WorkCompleted":
        return cls(n=event.n, action=event.action, type=event.type, actor=event.actor, todo=bool(event.data.get(Work.todo)))


@dataclass(frozen=True)
class PlanCompleted(ResourceEvent):
    on: ClassVar[str] = "plan.completed"


@dataclass(frozen=True)
class WorkLogged(ResourceEvent):
    on: ClassVar[str] = "work.updated"
    section: str = ""


def working(context: Context) -> list:
    return [w for w in context.journal.get(Works).rows.standing() if not w.parked]


class HoldUntilDeclared(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if event.type != "work" and (event.type, event.action) != ("agent", "created"):
            return
        bus.defer_once(f"undeclared {context.record.root} {context.record.env}", lambda: self.settle(context))

    def settle(self, context: Context) -> None:
        if working(context):
            context.release()
        else:
            context.hold("undeclared held")


class OpenWork(Handler):
    def handle(self, context: Context, event: WorkCreated) -> None:
        tracker.begin(event, context.record)
        works = context.journal.get(Works)
        n = works.load(event.n).todo
        if not n:
            return
        todo = context.journal.get(Todos).load(n)
        works.link(event.n, todo.ref)
        context.journal.get(Todos).update(todo.n, status="started", work=event.n)


class CloseWork(Handler):
    def handle(self, context: Context, event: WorkCompleted) -> None:
        tracker.end(event, context.record)
        name_parked(context)
        n = context.journal.get(Works).load(event.n).todo
        if not n:
            return
        todos = context.journal.get(Todos)
        if todos.load(n).completed:
            return
        if event.todo:
            todos.complete(int(n), how=f"work {event.n} ended")
        else:
            todos.update(int(n), status="")


def name_parked(context: Context) -> None:
    """Names parked work once for each time it was parked, and only while nothing else is ready: parking it was the agent's own choice."""
    parked = {parking(w): w for w in context.journal.get(Works).rows.standing() if w.parked}
    state = context.record.state(context.feature.name)
    named = set(state.get(NAMED_PARKED, [])) & set(parked)
    unnamed = [w for key, w in parked.items() if key not in named]
    agent = context.journal.get(Agents).primary()
    if not unnamed or not agent or ready(context.record):
        return
    context.speaking_to(agent).agent.say("parked", n=unnamed[0].n, title=unnamed[0].title, why=unnamed[0].parked,
                                         more=f" and {len(unnamed) - 1} more" if len(unnamed) > 1 else "")
    state.set(NAMED_PARKED, sorted(set(parked)))


def parking(work) -> str:
    return f"{work.n}:{work.parked}"


class NameParkedOnTodoDone(Handler):
    def handle(self, context: Context, event: TodoCompleted) -> None:
        if not any(int(w.todo) == event.n for w in context.journal.get(Works).rows.standing()):
            name_parked(context)


def name_unblocked(context: Context, ref: str) -> None:
    todos, agent = context.journal.get(Todos), context.journal.get(Agents).primary()
    if not agent:
        return
    for row in [r for r in todos.rows.standing() if ref in r.after and not r.blocked and not todos.waits(r)]:
        context.speaking_to(agent).agent.say("unblocked", n=row.n, title=row.title, closed=ref.replace(":", " "))


class UnblockWaitingRows(Handler):
    def handle(self, context: Context, event: TodoCompleted) -> None:
        if not context.journal.get(Todos).load(event.n).struck:
            name_unblocked(context, f"todo:{event.n}")


class UnblockWhenPlanFinishes(Handler):
    def handle(self, context: Context, event: PlanCompleted) -> None:
        name_unblocked(context, f"plan:{event.n}")


class AskStillBlocked(Handler):
    def handle(self, context: Context, event: TodoCompleted) -> None:
        state = context.record.state(context.feature.name)
        closed = int(state.get("closed", 0)) + 1
        state.set("closed", closed)
        agent = context.journal.get(Agents).primary()
        if not agent or closed % max(1, int(context.settings["ask_blocked_every"])):
            return
        asked_at, now = dict(state.get("asked", {})), time.time()
        due = [r for r in context.journal.get(Todos).rows.standing() if r.blocked and now - float(asked_at.get(str(r.n), 0)) > ASKED_AGAIN_AFTER]
        asked = questioned(context.record)
        for row in [r for r in due if r.ref not in asked]:
            context.speaking_to(agent).agent.say("still blocked", n=row.n, title=row.title, why=row.blocked.rstrip("."))
            asked_at[str(row.n)] = now
        state.set("asked", asked_at)


class EndWorkWithTodo(Handler):
    def handle(self, context: Context, event: TodoCompleted) -> None:
        works = context.journal.get(Works)
        for work in works.rows.standing():
            if int(work.todo) == event.n:
                works.complete(work.n, how=context.journal.get(Todos).load(event.n).outcome or f"todo {event.n} done")


class TrackFiles(Handler):
    def handle(self, context: AgentContext, event: FileEdited) -> None:
        for work in working(context)[:1]:
            tracker.record_edit(context.agent.row, context.record, work, event)


POLLED = 3
OPEN_REMINDERS = 3
FIRST_AFTER = 5
CARRY_ON_TIMES = 3
POLLING = "polling"
POLLING_NO_WAKE = "polling, no wake"


class NameRepeatedChecks(Handler):
    def handle(self, context: AgentContext, event: ToolFinished) -> None:
        shell = [c["command"] for c in context.agent.row.data.get("commands") or [] if c.get("tool") == "Bash" and c.get("command")][-POLLED:]
        if len(shell) < POLLED or len(set(shell)) > 1 or any(w.awaiting for w in working(context)):
            return
        if context.once("polled", shell[-1]):
            provider = PROVIDERS.get(context.agent.row.provider)
            context.agent.whisper(POLLING if provider and provider.background_wakes else POLLING_NO_WAKE, times=POLLED, command=shell[-1][:80])


class ClearWaitOnActivity(Handler):
    def handle(self, context: AgentContext, event: ToolFinished) -> None:
        runs = command_runs(context.agent.row)
        started = runs[-1].at if runs else 0.0
        for w in working(context)[:1]:
            if not w.is_self_clearing or started <= float(w.awaiting_since):
                continue
            context.journal.get(Works).update(w.n, awaiting="")
            context.agent.whisper("wait cleared", awaiting=w.awaiting)


class AskStillAwaiting(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        every = context.settings.ask_awaiting_every
        for w in working(context)[:1]:
            if not w.is_self_clearing or not every:
                continue
            minutes = int((time.time() - (w.awaiting_since or time.time())) // 60)
            if minutes >= every and context.once("awaiting asked", f"{w.n}:{minutes // every}"):
                context.agent.say("still awaiting", awaiting=w.awaiting, minutes=minutes)


class RemindOpenWork(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        for w in [w for w in working(context)[:1] if context.at_most("open", f"{w.n}:{w.updated}", OPEN_REMINDERS)]:
            context.agent.say("open" if w.sections else "unlogged", n=w.n)


class CountEdits(Handler):
    hooks = (HookEvent.POST_TOOL_USE,)
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        work = working(context)[:1]
        if not context.agent.row.wrote or not work:
            return
        row, name = context.agent.row, context.feature.name
        edits = trigger.last(context.record, row.title, name).edits + 1
        trigger.write(context.record, row, name, edits=edits)
        every = context.settings.name_work_every
        if every and edits % every == 0:
            context.agent.whisper("in hand", n=work[0].n, title=work[0].title)
        if edits >= context.settings.log_after:
            context.hold("log held", edits=edits, n=work[0].n)


class ResetEditsOnLog(Handler):
    def handle(self, context: Context, event: WorkLogged) -> None:
        if not event.section:
            return
        for row in context.feature.reached(context.record, context.feature.lines["log held"].reach):
            trigger.write(context.record, row, context.feature.name, edits=0)
        context.release()


def next_row(standing: bool):
    def about(context, agent) -> list[Sent]:
        open_work = working(context)
        if bool(open_work) != standing or (open_work and open_work[0].awaiting):
            return []
        return [Sent(f"{row.n}:{row.updated}", {"n": row.n, "work": open_work[0].n, "rows": [row.ref, open_work[0].ref]} if standing else
                     {"n": row.n, "rows": [row.ref]}) for row in ready(context.record)[:1]]
    return about




def stopped_with_work(context, agent) -> list[Sent]:
    if agent.idle_for < FIRST_AFTER * MINUTE:
        return []
    return [Sent(f"{work.n}:{work.updated}", {"n": work.n, "title": work.title, "rows": [work.ref]}) for work in carried_on(context.record)[:1]]


def last_heard_from_the_user(context, agent) -> float:
    """When the person last spoke to this agent: a message they wrote in the viewer or a prompt they typed themselves, never a line the journal typed."""
    written = [row["created"] for row in Messages(context.record, actor=SYSTEM).rows.summaries() if row["seen"][:1] == [USER] and not row["deleted"]]
    return max([float(agent.person_at), *written])


def stopped_in_auto(context, agent) -> list[Sent]:
    """With auto mode on, an agent that stopped long after the person last spoke is told to carry on, unless the person stopped it themselves."""
    after = context.settings.carry_on_after * MINUTE
    if not automatic(context.record) or agent.subagent or agent.paused or agent.idle_for < FIRST_AFTER * MINUTE or time.time() - last_heard_from_the_user(context, agent) < after:
        return []
    provider = PROVIDERS.get(agent.provider)
    if provider is not None and agent.transcript and provider().interrupted_by_user(Path(agent.transcript)):
        return []
    return [Sent(f"{agent.at}", {"minutes": int(after // MINUTE)})]


def nothing_ready(context, agent) -> list[Sent]:
    if agent.idle_for < FIRST_AFTER * MINUTE or working(context) or ready(context.record):
        return []
    held = waiting_rows(context.record)
    return [Sent(",".join(str(t.n) for t in held), {"rows": named_rows(held)})] if held else []

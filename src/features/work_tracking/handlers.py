import time
from dataclasses import dataclass
from typing import ClassVar

from engine.events import AgentReported, AnyEvent, ClockTicked, FileEdited, ResourceEvent, ToolFinished
from features import trigger
from features.parts import WHOLE_FEATURE, AgentContext, Context, Handler
from features.work_tracking import tracker
from engine.transcript import IDLE
from features.work_tracking.next import next
from resources.types import Work
from features.status_bar.runs import command_runs

ASKED_AGAIN_AFTER = 600


@dataclass(frozen=True)
class WorkCreated(ResourceEvent):
    on: ClassVar[str] = "work.created"


@dataclass(frozen=True)
class WorkCompleted(ResourceEvent):
    on: ClassVar[str] = "work.completed"
    todo: bool = False

    @classmethod
    def read(cls, event) -> "WorkCompleted":
        return cls(n=event.n, action=event.action, type=event.type, actor=event.actor, todo=bool(event.data.get(Work.todo)))


@dataclass(frozen=True)
class TodoCompleted(ResourceEvent):
    on: ClassVar[str] = "todo.completed"


@dataclass(frozen=True)
class PlanCompleted(ResourceEvent):
    on: ClassVar[str] = "plan.completed"


@dataclass(frozen=True)
class WorkLogged(ResourceEvent):
    on: ClassVar[str] = "work.updated"
    section: str = ""


def working(context: Context) -> list:
    return [w for w in context.journal.works._standing() if not w.parked]


class HoldUntilDeclared(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if event.type != "work" and (event.type, event.action) != ("agent", "created"):
            return
        if working(context):
            context.release()
        else:
            context.hold("undeclared held")


class OpenWork(Handler):
    def handle(self, context: Context, event: WorkCreated) -> None:
        tracker.begin(event, context.record)
        works = context.journal.works
        n = works.load(event.n).todo
        if not n:
            return
        todo = context.journal.todos.load(int(n))
        works.link(event.n, todo.ref)
        context.journal.todos.update(todo.n, status="started", work=event.n)


class CloseWork(Handler):
    def handle(self, context: Context, event: WorkCompleted) -> None:
        tracker.end(event, context.record)
        name_parked(context)
        n = context.journal.works.load(event.n).todo
        if not n:
            return
        todos = context.journal.todos
        if todos.load(int(n)).completed:
            return
        if event.todo:
            todos.complete(int(n), how=f"work {event.n} ended")
        else:
            todos.update(int(n), status="")


def name_parked(context: Context) -> None:
    parked = [w for w in context.journal.works._standing() if w.parked]
    agent = context.journal.agents.primary()
    state, now = context.record.state(context.feature.name), time.time()
    if not parked or not agent or now - float(state.get("parked_named", 0)) <= ASKED_AGAIN_AFTER:
        return
    context.speaking_to(agent).agent.say("parked", n=parked[0].n, title=parked[0].title, why=parked[0].parked,
                                         more=f" and {len(parked) - 1} more" if len(parked) > 1 else "")
    state.set("parked_named", now)


class NameParkedOnTodoDone(Handler):
    def handle(self, context: Context, event: TodoCompleted) -> None:
        if not any(int(w.todo) == event.n for w in context.journal.works._standing()):
            name_parked(context)


def name_unblocked(context: Context, ref: str) -> None:
    todos, agent = context.journal.todos, context.journal.agents.primary()
    if not agent:
        return
    for row in [r for r in todos._standing() if ref in (r.after or []) and not r.blocked and not todos.waits(r)]:
        context.speaking_to(agent).agent.say("unblocked", n=row.n, title=row.title, closed=ref.replace(":", " "))


class UnblockWaitingRows(Handler):
    def handle(self, context: Context, event: TodoCompleted) -> None:
        if not context.journal.todos.load(event.n).struck:
            name_unblocked(context, f"todo:{event.n}")


class UnblockWhenPlanFinishes(Handler):
    def handle(self, context: Context, event: PlanCompleted) -> None:
        name_unblocked(context, f"plan:{event.n}")


class AskStillBlocked(Handler):
    def handle(self, context: Context, event: TodoCompleted) -> None:
        state = context.record.state(context.feature.name)
        closed = int(state.get("closed", 0)) + 1
        state.set("closed", closed)
        agent = context.journal.agents.primary()
        if not agent or closed % max(1, int(context.settings["ask_blocked_every"])):
            return
        asked, now = state.get("asked", {}), time.time()
        for row in [r for r in context.journal.todos._standing() if r.blocked and now - float(asked.get(str(r.n), 0)) > ASKED_AGAIN_AFTER]:
            context.speaking_to(agent).agent.say("still blocked", n=row.n, title=row.title, why=row.blocked.rstrip("."))
            asked[str(row.n)] = now
        state.set("asked", asked)


class EndWorkWithTodo(Handler):
    def handle(self, context: Context, event: TodoCompleted) -> None:
        works = context.journal.works
        for work in works._standing():
            if int(work.todo) == event.n:
                works.complete(work.n, how=context.journal.todos.load(event.n).outcome or f"todo {event.n} done")


class TrackFiles(Handler):
    def handle(self, context: AgentContext, event: FileEdited) -> None:
        for work in working(context)[:1]:
            tracker.record_edit(context.agent.row, context.record, work, event)


POLLED = 3


class NameRepeatedChecks(Handler):
    def handle(self, context: AgentContext, event: ToolFinished) -> None:
        shell = [c["command"] for c in context.agent.row.data.get("commands") or [] if c.get("tool") == "Bash" and c.get("command")][-POLLED:]
        if len(shell) < POLLED or len(set(shell)) > 1 or any(w.awaiting for w in working(context)):
            return
        if context.once("polled", shell[-1]):
            context.agent.whisper("polling", times=POLLED, command=shell[-1][:80])


class ClearWaitOnActivity(Handler):
    def handle(self, context: AgentContext, event: ToolFinished) -> None:
        if not context.agent.row.wrote:
            return
        runs = command_runs(context.agent.row)
        started = runs[-1].at if runs else 0.0
        for w in working(context)[:1]:
            if not w.awaiting or started <= float(w.awaiting_since):
                continue
            context.journal.works.update(w.n, awaiting="")
            context.agent.whisper("wait cleared", awaiting=w.awaiting)


class AskStillAwaiting(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        every = context.settings.ask_awaiting_every
        for w in working(context)[:1]:
            if not w.awaiting or not every:
                continue
            minutes = int((time.time() - (w.awaiting_since or time.time())) // 60)
            if minutes >= every and context.state.get("awaiting asked") != f"{w.n}:{minutes // every}":
                context.state.set("awaiting asked", f"{w.n}:{minutes // every}")
                context.agent.say("still awaiting", awaiting=w.awaiting, minutes=minutes)


class RemindOpenWork(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        for w in working(context)[:1]:
            context.agent.say("open" if w.sections else "unlogged", n=w.n)


class CountEdits(Handler):
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
        for row in context.feature.live(context.record):
            trigger.write(context.record, row, context.feature.name, edits=0)
        context.release()


class OfferNextRow(Handler):
    behaviour = "auto"

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        offer(context)


class OfferNextRowOnTheClock(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        if context.on("auto") and context.agent.row.status == IDLE:
            offer(context)


def offer(context: AgentContext) -> None:
    open_work = working(context)
    if open_work and (context.agent.row.status != IDLE or open_work[0].awaiting):
        return
    row = next(context.record)
    stretch = f"{row.n}:{context.agent.row.at}" if row else ""
    if not row or context.state.get("offered") == stretch:
        return
    context.state.set("offered", stretch)
    if open_work:
        context.agent.say("next while waiting", n=row.n, work=open_work[0].n)
        return
    context.agent.say("next", n=row.n)

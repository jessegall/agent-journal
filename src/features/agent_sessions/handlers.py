import time
from pathlib import Path
from dataclasses import dataclass
from typing import ClassVar

from engine.events.engine import ClockTicked
from engine.events.agents import AgentReported
from engine.events.resources import AgentChanged, QuestionAnswered, ResourceCreated, ResourceEvent
from engine.sessions import Sessions, live
from providers.payload import HookEvent
from features.parts import AgentContext, Context, Handler, OnAgentUpdated
from providers import PROVIDERS
from resources.base import SYSTEM
from resources.types import COMPACTING, STOPPED, SUBAGENT
from features.trigger import MINUTE
from controllers.types import CONTROLLERS, Agents, Environments, Questions, Todos, environment_records
from engine.record import Record


STOP = "stop"
TAKE_OVER = 1

REPORT_WITHIN = 1800

KEPT_COMPACTIONS = 50
ONE_COMPACTION = 120


@dataclass(frozen=True)
class TodoUpdated(ResourceEvent):
    on: ClassVar[str] = "todo.updated"


class HoldEvicted(Handler):
    behaviour = "eviction"

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        sessions = Sessions(context.record.root)
        session = context.agent.session
        gone = sessions.read(session).evicted
        if gone and not sessions.environment(session):
            context.hold("evicted", "eviction", environment=repr(gone["environment"]), by=gone["by"], why=gone["why"])
        else:
            context.release("eviction")


class TakeOverOnAnswer(Handler):
    """A session that started beside another waits for the user's answer: taking the environment over unbinds the session that was there."""

    def handle(self, context: Context, event: QuestionAnswered) -> None:
        sessions = Sessions(context.record.root)
        session = sessions.asking(event.n)
        if not session or Questions(context.record, actor=SYSTEM).load(event.n).chosen != TAKE_OVER:
            return
        name = sessions.read(session).takeover["environment"]
        places = Environments(Record(context.record.root, name), actor=SYSTEM, session=session)
        places.claim(places.rows.by_title(name).n, "the user chose to take it over")


class RecordCompactions(Handler):
    hooks = (HookEvent.PRE_COMPACT,)
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        row = context.agent.row
        kept = row.data.get("compactions") or []
        if row.status != COMPACTING or (kept and time.time() - float(kept[-1]["at"]) < ONE_COMPACTION):
            return
        context.journal.get(Agents).appended(row, "compactions", {"at": time.time()}, KEPT_COMPACTIONS)


class AskToStop(Handler):
    def handle(self, context: Context, event: AgentChanged) -> None:
        row = context.journal.get(Agents).rows.peek(event.agent)
        stopping = row.data.get("stopping") or {}
        provider = PROVIDERS.get(row.provider)
        if not stopping or not provider or not row.live:
            return
        speaking = context.speaking_to(row)
        if speaking.once(STOP, f"{stopping['task']}|{stopping['at']}"):
            speaking.agent.say(STOP, description=stopping["description"], how=provider().stop_instruction(stopping["task"]))


class MarkSilentStopped(Handler):
    behaviour = "liveness"

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        agents = context.journal.get(Agents)
        silent = time.time() - context.settings.quiet * MINUTE
        sessions = Sessions(context.record.root)
        for row in agents.rows.every():
            if float(row.at) >= silent or not has_ended(row, sessions, agents):
                continue
            stop(agents, row)


class StopEndedAtSessionStart(Handler):
    """A conversation that starts ends the rows of earlier ones whose process is gone, at once, so a row left working by an agent that died does not outlive it until the quiet minutes pass."""

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        if event.hook != HookEvent.SESSION_START:
            return
        agents, sessions = context.journal.get(Agents), Sessions(context.record.root)
        for row in agents.rows.every():
            if row.title != event.session and has_ended(row, sessions, agents):
                stop(agents, row)


def has_ended(row, sessions: Sessions, agents: Agents) -> bool:
    """Whether a row still counted as running belongs to a session that is gone, and is not being taken over by a newer process of the same conversation."""
    return row.live and not live(sessions.read(row.title)) and not relaunching(row, sessions, agents)


def relaunching(row, sessions: Sessions, agents: Agents) -> bool:
    """A conversation started again in a new process keeps its old session record, with the dead process in it, until the first hook of the new process takes it over; until then the newer live process of the same provider in its environment, which has no row of its own yet, is its successor, and the row is not ended."""
    held = sessions.read(row.title)
    reported = {sessions.read(other.title).pid for other in agents.rows.every() if other.event and other.n != row.n}
    return any(name != row.title and other.environment == held.environment and other.provider == held.provider and other.since > float(row.at) and live(other)
               and other.pid not in reported for name, other in sessions.all().items())


def stop(agents: Agents, row) -> None:
    """A session that ended is stopped, with the command it left running and the stop it was asked for dropped, so no later session hears of them."""
    agents.stamp(row.n, status=STOPPED, running={}, stopping={})


def stop_ended(root: Path) -> str:
    """Stops the agent rows of every session that ended before this upgrade."""
    ended = []
    for record in environment_records(Path(root)):
        agents, sessions = Agents(record, actor=SYSTEM), Sessions(record.root)
        for row in agents.rows.every():
            if not has_ended(row, sessions, agents):
                continue
            stop(agents, row)
            ended.append(row.title)
    return f"sessions that had ended are stopped: {', '.join(ended)}" if ended else "no ended session was left running"


class KeepSubagentAlive(Handler):
    behaviour = "subagents"

    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type == "agent":
            return
        made = context.journal.get(CONTROLLERS[event.type]).load(event.n)
        if made.agent:
            agents = context.journal.get(Agents)
            agents.update(agents.by_session(made.agent).n, active=time.time(), dispatcher=made.dispatcher, status=SUBAGENT)


class LinkReportToSubagent(Handler):
    behaviour = "subagents"

    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type != "report" or event.actor != "agent":
            return
        agents = context.journal.get(Agents)
        row = agents.primary()
        linked = dict((row and row.data.get("subagent_reports")) or {})
        ended = [s for s in (row and row.data.get("subagent_rows")) or [] if s.get("ended") and s["id"] not in linked and time.time() - s["ended"] < REPORT_WITHIN]
        if ended:
            agents.update(row.n, subagent_reports={**linked, max(ended, key=lambda s: s["ended"])["id"]: event.n})


class HandBackReport(Handler):
    behaviour = "subagents"

    def handle(self, context: Context, event: TodoUpdated) -> None:
        todos = context.journal.get(Todos)
        todo = todos.load(event.n)
        reported = todo.reported or {}
        if not reported or reported.get("notified"):
            return
        todos.update(todo.n, reported={**reported, "notified": True})
        if reported.get("dispatcher"):
            dispatcher = context.journal.get(Agents).by_session(reported["dispatcher"])
            context.speaking_to(dispatcher).agent.say("reported", who=reported.get("agent"), n=todo.n, how=reported.get("how", ""))


class ClearLapsedAssignments(Handler):
    behaviour = "subagents"

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        subagents = {a.title: a for a in context.journal.get(Agents).rows.standing() if a.status == SUBAGENT}
        if not subagents:
            return
        limit = context.settings.lapse * MINUTE
        todos = context.journal.get(Todos)
        for t in todos.rows.standing():
            who = t.assigned
            if not who or who not in subagents or time.time() - float(subagents[who].active) < limit:
                continue
            todos.unassign(t.n, lapsed=who)
            dispatcher = context.journal.get(Agents).by_session(subagents[who].dispatcher)
            context.speaking_to(dispatcher).agent.say("lapsed", who=who, n=t.n, minutes=limit // MINUTE)


class ClearLapsedAssignmentsOnChange(OnAgentUpdated, ClearLapsedAssignments):
    pass

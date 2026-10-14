from declaring.trigger import MINUTE
from events import Fact
from events.agent_sessions import (AssignmentLapsed, CompactionStarted, EvictionLifted, ReportHandedBack, ReportNoticed, SessionEnded, SessionEvicted, SilenceDue, StopAsked,
                                   SubagentAlive, SubagentReportLinked, TakeOverChosen)
from events.agents import AgentChanged, AgentReported, ClockTicked
from events.questions import QuestionCompleted
from events.resources import ResourceCreated
from events.todos import TodoUpdated
from features.agent_sessions.ending import has_ended
from payload import HookEvent
from receiving import Listener
from resources.types import COMPACTING, SUBAGENT, AgentRow, Environment, Question, Todo
from serving import Clock, Providers, ReadElsewhere, ReadRows, ReadSessions, Settings

TAKE_OVER = 1
REPORT_WITHIN = 1800
ONE_COMPACTION = 120


def lapsed(agents: ReadRows[AgentRow], todos: ReadRows[Todo], settings: Settings, clock: Clock) -> list[Fact]:
    """The to-dos a subagent held for longer than it stays quiet, each with the agent that dispatched it."""
    subagents = {a.title: a for a in agents.rows.standing() if a.status == SUBAGENT}
    limit, facts = settings.lapse * MINUTE, []
    for todo in todos.rows.standing():
        who = todo.assigned
        dispatcher = agents.peek_session(subagents[who].dispatcher) if who in subagents else None
        if dispatcher and clock.now() - float(subagents[who].active) >= limit:
            facts.append(AssignmentLapsed(agent=dispatcher.n, todo=todo.n, who=who, minutes=int(limit // MINUTE)))
    return facts


class SpotEviction(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], sessions: ReadSessions, settings: Settings) -> list[Fact]:
        session = agents.peek(event.agent).title
        gone = sessions.read(session).evicted
        if not settings.is_on("eviction"):
            return []
        if gone and not sessions.environment(session):
            return [SessionEvicted(agent=event.agent, environment=repr(gone["environment"]), by=gone["by"], why=gone["why"])]
        return [EvictionLifted(agent=event.agent)]


class SpotTakeOver(Listener[QuestionCompleted]):
    def listen(self, event: QuestionCompleted, questions: ReadRows[Question], places: ReadRows[Environment], sessions: ReadSessions) -> list[Fact]:
        session = sessions.asking(event.n)
        if not session or questions.load(event.n).chosen != TAKE_OVER:
            return []
        name = sessions.read(session).takeover["environment"]
        return [TakeOverChosen(session=session, environment=name, place=places.rows.by_title(name).n)]


class SpotSilentSessions(Listener[SilenceDue]):
    def listen(self, event: SilenceDue, agents: ReadRows[AgentRow], sessions: ReadSessions, settings: Settings, clock: Clock) -> list[Fact]:
        silent = clock.now() - settings.quiet * MINUTE
        return [SessionEnded(row=row.n) for row in agents.rows.every() if settings.is_on("liveness") and float(row.at) < silent and has_ended(row, sessions, agents)]


class SpotEndedSessions(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], sessions: ReadSessions) -> list[Fact]:
        if event.hook != HookEvent.SESSION_START:
            return []
        return [SessionEnded(row=row.n) for row in agents.rows.every() if row.title != event.session and has_ended(row, sessions, agents)]


class SpotCompaction(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], clock: Clock) -> list[Fact]:
        row = agents.peek(event.agent)
        kept = row.data.get("compactions") or []
        if event.hook != HookEvent.PRE_COMPACT or row.status != COMPACTING or (kept and clock.now() - float(kept[-1]["at"]) < ONE_COMPACTION):
            return []
        return [CompactionStarted(agent=row.n, at=clock.now())]


class SpotStopAsked(Listener[AgentChanged]):
    def listen(self, event: AgentChanged, agents: ReadRows[AgentRow], providers: Providers) -> list[Fact]:
        row = agents.peek(event.agent)
        stopping = row.data.get("stopping") or {}
        provider = providers.offers(row.provider)
        if not stopping or not provider or not row.live:
            return []
        return [StopAsked(agent=row.n, task=stopping["task"], description=stopping["description"], how=provider.stop_instruction(stopping["task"])).once(f"{row.n}:{stopping['task']}|{stopping['at']}")]


class SpotSubagentAlive(Listener[ResourceCreated]):
    def listen(self, event: ResourceCreated, elsewhere: ReadElsewhere, settings: Settings, clock: Clock) -> list[Fact]:
        if event.type == "agent" or not settings.is_on("subagents"):
            return []
        made = elsewhere.here().rows_named(event.type).load(event.n)
        return [SubagentAlive(session=made.agent, dispatcher=made.dispatcher, at=clock.now())] if made.agent else []


class SpotSubagentReport(Listener[ResourceCreated]):
    def listen(self, event: ResourceCreated, agents: ReadRows[AgentRow], settings: Settings, clock: Clock) -> list[Fact]:
        row = agents.primary_to_read()
        if event.type != "report" or event.actor != "agent" or not row or not settings.is_on("subagents"):
            return []
        linked = dict(row.data.get("subagent_reports") or {})
        ended = [s for s in row.data.get("subagent_rows") or [] if s.get("ended") and s["id"] not in linked and clock.now() - s["ended"] < REPORT_WITHIN]
        return [SubagentReportLinked(agent=row.n, reports=tuple({**linked, max(ended, key=lambda s: s["ended"])["id"]: event.n}.items()))] if ended else []


class SpotReportedTodo(Listener[TodoUpdated]):
    def listen(self, event: TodoUpdated, todos: ReadRows[Todo], agents: ReadRows[AgentRow], settings: Settings) -> list[Fact]:
        reported = todos.load(event.n).reported or {}
        if not settings.is_on("subagents") or not reported or reported.get("notified"):
            return []
        dispatcher = agents.peek_session(reported["dispatcher"]) if reported.get("dispatcher") else None
        told = [ReportHandedBack(agent=dispatcher.n, todo=event.n, who=reported.get("agent"), how=reported.get("how", ""))] if dispatcher else []
        return [ReportNoticed(todo=event.n), *told]


class SpotLapsedAssignments(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, agents: ReadRows[AgentRow], todos: ReadRows[Todo], settings: Settings, clock: Clock) -> list[Fact]:
        return lapsed(agents, todos, settings, clock) if settings.is_on("subagents") else []


class SpotLapsedAssignmentsOnChange(Listener[AgentChanged]):
    def listen(self, event: AgentChanged, agents: ReadRows[AgentRow], todos: ReadRows[Todo], settings: Settings, clock: Clock) -> list[Fact]:
        return lapsed(agents, todos, settings, clock) if event.action == "updated" and settings.is_on("subagents") else []

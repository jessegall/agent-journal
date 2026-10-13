from controllers.types import Environments
from events import Fact
from events.agent_sessions import (AssignmentLapsed, CompactionStarted, EvictionLifted, ReportHandedBack, ReportNoticed, SessionEnded, SessionEvicted, StopAsked,
                                   SubagentAlive, SubagentReportLinked, TakeOverChosen)
from features.agent_sessions.ending import stop
from receiving import Handler
from resources.base import SYSTEM
from resources.types import SUBAGENT, AgentRow, Todo
from serving import Chat, Elsewhere, Rows

STOP = "stop"
KEPT_COMPACTIONS = 50


class HoldEvicted(Handler[SessionEvicted]):
    def handle(self, event: SessionEvicted, chat: Chat) -> list[Fact]:
        chat.hold("evicted", "eviction", environment=event.environment, by=event.by, why=event.why)
        return []


class ReleaseEvicted(Handler[EvictionLifted]):
    def handle(self, event: EvictionLifted, chat: Chat) -> list[Fact]:
        chat.release("eviction")
        return []


class TakeOverOnAnswer(Handler[TakeOverChosen]):
    def handle(self, event: TakeOverChosen, elsewhere: Elsewhere) -> list[Fact]:
        Environments(elsewhere.named(event.environment).record, actor=SYSTEM, session=event.session).claim(event.place, "the user chose to take it over")
        return []


class StopEndedSession(Handler[SessionEnded]):
    def handle(self, event: SessionEnded, agents: Rows[AgentRow]) -> list[Fact]:
        stop(agents, agents.load(event.row))
        return []


class RecordCompaction(Handler[CompactionStarted]):
    def handle(self, event: CompactionStarted, agents: Rows[AgentRow]) -> list[Fact]:
        agents.appended(agents.load(event.agent), "compactions", {"at": event.at}, KEPT_COMPACTIONS)
        return []


class AskToStop(Handler[StopAsked]):
    def handle(self, event: StopAsked, chat: Chat) -> list[Fact]:
        chat.say(STOP, description=event.description, how=event.how)
        return []


class KeepSubagentAlive(Handler[SubagentAlive]):
    def handle(self, event: SubagentAlive, agents: Rows[AgentRow]) -> list[Fact]:
        agents.update(agents.by_session(event.session).n, active=event.at, dispatcher=event.dispatcher, status=SUBAGENT)
        return []


class LinkReportToSubagent(Handler[SubagentReportLinked]):
    def handle(self, event: SubagentReportLinked, agents: Rows[AgentRow]) -> list[Fact]:
        agents.update(event.agent, subagent_reports=dict(event.reports))
        return []


class NoticeReport(Handler[ReportNoticed]):
    def handle(self, event: ReportNoticed, todos: Rows[Todo]) -> list[Fact]:
        todos.update(event.todo, reported={**todos.load(event.todo).reported, "notified": True})
        return []


class HandBackReport(Handler[ReportHandedBack]):
    def handle(self, event: ReportHandedBack, chat: Chat) -> list[Fact]:
        chat.say("reported", who=event.who, n=event.todo, how=event.how)
        return []


class ClearLapsedAssignment(Handler[AssignmentLapsed]):
    def handle(self, event: AssignmentLapsed, todos: Rows[Todo], chat: Chat) -> list[Fact]:
        todos.unassign(event.todo, lapsed=event.who)
        chat.say("lapsed", who=event.who, n=event.todo, minutes=event.minutes)
        return []

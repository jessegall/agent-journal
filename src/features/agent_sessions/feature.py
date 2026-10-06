from features.agent_sessions.details import AgentSessionsDetails
from features.agent_sessions.handlers import AskToStop, ClearLapsedAssignments, ClearLapsedAssignmentsOnChange, HandBackReport, HoldEvicted, KeepSubagentAlive, LinkReportToSubagent, MarkSilentStopped, RecordCompactions
from features.base import Feature
from features.journal import Journal


class AgentSessions(Feature):
    details = AgentSessionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(HoldEvicted())
        journal.events.handler(MarkSilentStopped())
        journal.events.handler(AskToStop())
        journal.events.handler(RecordCompactions())
        journal.events.handler(KeepSubagentAlive())
        journal.events.handler(HandBackReport())
        journal.events.handler(LinkReportToSubagent())
        journal.events.handler(ClearLapsedAssignments())
        journal.events.handler(ClearLapsedAssignmentsOnChange())

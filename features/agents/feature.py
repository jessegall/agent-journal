from features.agents.details import AgentsDetails
from features.agents.handlers import ClearLapsedAssignments, HandBackReport, HoldEvicted, KeepSubagentAlive, MarkSilentStopped
from features.base import Feature
from features.journal import Journal


class AgentsFeature(Feature):
    details = AgentsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(HoldEvicted())
        journal.events.handler(MarkSilentStopped())
        journal.events.handler(KeepSubagentAlive())
        journal.events.handler(HandBackReport())
        journal.events.handler(ClearLapsedAssignments())

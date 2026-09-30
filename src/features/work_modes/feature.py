from features.base import Feature
from features.journal import Journal
from features.session_briefing.start import MODE, START_PARTS
from features.work_modes.details import WorkModesDetails
from features.work_modes.interceptors import RefuseDispatchInSolo, RefuseHelperInSolo, RemindOrchestrator
from features.work_modes.modes import carried


class WorkModes(Feature):
    details = WorkModesDetails

    def register(self, journal: Journal) -> None:
        START_PARTS[MODE] = carried
        journal.agent.canceler(RefuseDispatchInSolo())
        journal.agent.interceptor(RefuseHelperInSolo())
        journal.agent.interceptor(RemindOrchestrator())

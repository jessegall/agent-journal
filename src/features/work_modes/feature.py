from features.base import Feature
from features.journal import Journal
from features.session_briefing.start import MODE, START_PARTS
from features.work_modes.details import WorkModesDetails
from features.work_modes.interceptors import RefuseDispatchInSolo, RefuseHelperInSolo, RemindOrchestrator
from features.work_modes.modes import carried
from features.work_modes.routes import post_board, post_mode
from features.work_modes.shipped import SEQUENCES


class WorkModes(Feature):
    details = WorkModesDetails
    sequences = SEQUENCES

    def register(self, journal: Journal) -> None:
        journal.routes.add(post_mode)
        journal.routes.add(post_board)
        START_PARTS.add(self, carried, key=MODE)
        journal.agent.canceler(RefuseDispatchInSolo())
        journal.agent.interceptor(RefuseHelperInSolo())
        journal.agent.interceptor(RemindOrchestrator())

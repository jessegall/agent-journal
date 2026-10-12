from events.boards import BoardStarted
from expects import Given, Kept, Refused, Unchanged
from framework.base import Feature
from framework.journal import Journal
from features.session_briefing.start import MODE, START_PARTS
from features.work_modes.details import WorkModesDetails
from features.work_modes.handlers import OrchestrateWhenABoardStarts
from features.work_modes.interceptors import REFUSED, NameTheDrift, RefuseDispatchInSolo, RefuseHelperInSolo
from features.work_modes.modes import carried
from features.work_modes.routes import post_board, post_mode
from features.work_modes.shipped import SEQUENCES
from providers.payload import BashCall, Dispatch


HELPER_DISPATCH = BashCall.from_payload("Bash", {"command": 'journal helper dispatch Rhea "a job" --provider codex --model gpt-6-sol'}, {})
GIT_STATUS = BashCall.from_payload("Bash", {"command": "git status"}, {})


class WorkModes(Feature):
    details = WorkModesDetails
    sequences = SEQUENCES

    def register(self, journal: Journal) -> None:
        journal.events.handler(OrchestrateWhenABoardStarts(), expects=[
            Given(BoardStarted(n=1, type="board", action="started", actor="agent"), settings={"work_modes.mode": "orchestrator"}) >> Unchanged(),
        ])
        journal.routes.add(post_mode)
        journal.routes.add(post_board)
        START_PARTS.add(self, carried, key=MODE)
        journal.agent.canceler(RefuseDispatchInSolo(), expects=[
            Given(Dispatch("general-purpose", "sonnet", True), settings={"work_modes.mode": "solo"}) >> Refused(REFUSED),
            Given(Dispatch("Explore", "haiku", True, read_only=True), settings={"work_modes.mode": "solo"}) >> Kept(),
            Given(Dispatch("general-purpose", "sonnet", True), settings={"work_modes.mode": "builder"}) >> Kept(),
        ])
        journal.agent.interceptor(RefuseHelperInSolo(), expects=[
            Given(HELPER_DISPATCH, settings={"work_modes.mode": "solo"}) >> Refused(REFUSED),
            Given(HELPER_DISPATCH, settings={"work_modes.mode": "builder"}) >> Kept(),
            Given(GIT_STATUS, settings={"work_modes.mode": "solo"}) >> Kept(),
        ])
        journal.agent.interceptor(NameTheDrift(), expects=[
            Given(GIT_STATUS, settings={"work_modes.mode": "orchestrator"}) >> Kept(),
            Given(GIT_STATUS, settings={"work_modes.mode": "solo"}) >> Kept(),
        ])

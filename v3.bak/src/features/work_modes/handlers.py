from events import Fact
from events.boards import BoardStarted
from events.work_modes import BuilderHandedAway, DriftChecked, EditCounted, OrchestratorDrifted
from features.work_modes.details import ORCHESTRATOR
from features.work_modes.listeners import edits_key
from features.work_modes.modes import pick
from receiving import Handler
from serving import Chat, Elsewhere, Remembered


class OrchestrateWhenABoardStarts(Handler[BoardStarted]):
    def handle(self, event: BoardStarted, elsewhere: Elsewhere) -> list[Fact]:
        pick(elsewhere.here().record, ORCHESTRATOR, event.actor)
        return []


class CountTheEdit(Handler[EditCounted]):
    def handle(self, event: EditCounted, remembered: Remembered) -> list[Fact]:
        remembered.set(edits_key(event.mode, event.agent), event.edits)
        return []


class ClearTheCount(Handler[DriftChecked]):
    def handle(self, event: DriftChecked, remembered: Remembered) -> list[Fact]:
        remembered.set(edits_key(event.mode, event.agent), 0)
        return []


class NameTheOrchestratorsDrift(Handler[OrchestratorDrifted]):
    def handle(self, event: OrchestratorDrifted, chat: Chat, remembered: Remembered) -> list[Fact]:
        remembered.set(edits_key(event.mode, event.agent), 0)
        chat.nudge("drifted", edits=event.edits)
        return []


class NameTheBuildersHandingAway(Handler[BuilderHandedAway]):
    def handle(self, event: BuilderHandedAway, chat: Chat, remembered: Remembered) -> list[Fact]:
        remembered.set(edits_key(event.mode, event.agent), 0)
        chat.nudge("handed away", share=event.share, own=event.own, theirs=event.theirs)
        return []

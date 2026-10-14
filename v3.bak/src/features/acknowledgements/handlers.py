from events import Fact
from events.acknowledgements import FirstNodWithheld, NodWithheld, TurnReachedChat
from features.acknowledgements.details import KEPT_OUT
from features.acknowledgements.listeners import sent_turn
from receiving import Handler
from serving import Chat, Remembered


class FileTheAcknowledgement(Handler[NodWithheld]):
    def handle(self, event: NodWithheld, chat: Chat) -> list[Fact]:
        chat.post(event.text, event.turn, acknowledgement=True)
        return []


class ExplainTheWithholding(Handler[FirstNodWithheld]):
    def handle(self, event: FirstNodWithheld, chat: Chat) -> list[Fact]:
        chat.nudge(KEPT_OUT)
        return []


class KeepTheSentTurn(Handler[TurnReachedChat]):
    def handle(self, event: TurnReachedChat, remembered: Remembered) -> list[Fact]:
        remembered.set(sent_turn(event.agent), event.turn)
        return []

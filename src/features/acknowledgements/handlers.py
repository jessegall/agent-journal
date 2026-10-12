from events import Fact
from events.acknowledgements import FirstNodWithheld, NodWithheld
from features.acknowledgements.details import KEPT_OUT
from receiving import Handler
from serving import Chat


class FileTheAcknowledgement(Handler[NodWithheld]):
    def handle(self, event: NodWithheld, chat: Chat) -> list[Fact]:
        chat.post(event.text, event.turn, acknowledgement=True)
        return []


class ExplainTheWithholding(Handler[FirstNodWithheld]):
    def handle(self, event: FirstNodWithheld, chat: Chat) -> list[Fact]:
        chat.nudge(KEPT_OUT)
        return []

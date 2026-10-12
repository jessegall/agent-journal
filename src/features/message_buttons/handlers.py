from events import Fact
from events.message_buttons import AnsweredInOwnWords, ButtonsUnrunnable
from features.message_buttons.buttoned import of_kind
from receiving import Handler
from resources.types import Doc, Message, Report
from serving import Rows


class DropUnrunnableButtons(Handler[ButtonsUnrunnable]):
    def handle(self, event: ButtonsUnrunnable, messages: Rows[Message], docs: Rows[Doc], reports: Rows[Report]) -> list[Fact]:
        of_kind(event.type, messages, docs, reports).update(event.n, buttons=event.kept)
        return []


class AnswerInWords(Handler[AnsweredInOwnWords]):
    def handle(self, event: AnsweredInOwnWords, messages: Rows[Message], docs: Rows[Doc], reports: Rows[Report]) -> list[Fact]:
        of_kind(event.type, messages, docs, reports).action("set")(event.n, key="answered_own", value=event.words)
        return []

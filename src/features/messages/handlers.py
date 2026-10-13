from events import Fact
from events.messages import (AnswerHeld, AnswerOwed, AnswerRearmed, AnswersSettled, AnswerWaitBegan, BareNumbersNamed, FaceSent, InboxRearmed, InboxSettled, InboxUnread, MessageSettled,
                             RunTogether, TurnToPost)
from features.messages.listeners import ANSWER_HOLD, UNREAD_EVERY
from receiving import Handler
from resources.types import Message
from serving import Chat, Marks, Rows, Settings

UNREAD, ANSWERING = "messages.unread", "messages.answering"


class PostTurn(Handler[TurnToPost]):
    def handle(self, event: TurnToPost, chat: Chat) -> list[Fact]:
        chat.post(event.text, event.turn)
        return []


class NameFace(Handler[FaceSent]):
    def handle(self, event: FaceSent, chat: Chat) -> list[Fact]:
        chat.nudge("reaction", face=event.face)
        return []


class RearmInbox(Handler[InboxRearmed]):
    def handle(self, event: InboxRearmed, marks: Marks) -> list[Fact]:
        marks.write(UNREAD, uses=event.uses - UNREAD_EVERY)
        return []


class RearmAnswering(Handler[AnswerRearmed]):
    def handle(self, event: AnswerRearmed, marks: Marks) -> list[Fact]:
        marks.write(ANSWERING, uses=event.uses, count=0)
        return []


class ReleaseInbox(Handler[InboxSettled]):
    def handle(self, event: InboxSettled, chat: Chat, marks: Marks) -> list[Fact]:
        chat.release("unread")
        marks.write(UNREAD, count=0)
        return []


class NameInbox(Handler[InboxUnread]):
    def handle(self, event: InboxUnread, chat: Chat, marks: Marks, settings: Settings) -> list[Fact]:
        chat.nudge("inbox")
        count = marks.last(UNREAD).count + 1
        marks.write(UNREAD, count=count)
        if count > int(getattr(settings, "unread.patience")):
            chat.hold("inbox held", "unread")
        return []


class ReleaseAnswering(Handler[AnswersSettled]):
    def handle(self, event: AnswersSettled, chat: Chat, marks: Marks) -> list[Fact]:
        marks.write(ANSWERING, count=0)
        marks.write(ANSWER_HOLD, uses=0)
        chat.release("answering")
        return []


class BeginAnswerWait(Handler[AnswerWaitBegan]):
    def handle(self, event: AnswerWaitBegan, marks: Marks) -> list[Fact]:
        marks.write(ANSWER_HOLD, uses=event.uses)
        return []


class HoldUntilAnswered(Handler[AnswerHeld]):
    def handle(self, event: AnswerHeld, chat: Chat) -> list[Fact]:
        chat.hold("answer held", "answering", messages=event.messages)
        return []


class NameUnanswered(Handler[AnswerOwed]):
    def handle(self, event: AnswerOwed, chat: Chat, marks: Marks, settings: Settings) -> list[Fact]:
        count = marks.last(ANSWERING).count + 1
        marks.write(ANSWERING, count=count)
        if count <= int(getattr(settings, "answering.patience")):
            chat.nudge("answer", messages=event.messages, numbers=list(event.numbers), rows=list(event.rows))
        return []


class CloseTheMessage(Handler[MessageSettled]):
    def handle(self, event: MessageSettled, messages: Rows[Message]) -> list[Fact]:
        messages.close_once(event.n, event.how)
        return []


class NameRunTogether(Handler[RunTogether]):
    def handle(self, event: RunTogether, chat: Chat) -> list[Fact]:
        chat.nudge("paragraphs")
        return []


class NameBareNumbers(Handler[BareNumbersNamed]):
    def handle(self, event: BareNumbersNamed, chat: Chat) -> list[Fact]:
        chat.nudge("numbers", n=event.n, numbers=event.numbers)
        return []

from features.base import Feature
from features.message_buttons.details import MessageButtonsDetails
from features.message_buttons.handlers import AnswerInWords, DropUnknownButtons
from features.journal import Journal
from engine.events.resources import AnyEvent
from expects import Given, Unchanged, Updated
from resources.types import Message

STARTS = {"label": "Okay, start", "type": "plan", "n": 3, "action": "approve"}
NONSENSE = {"label": "Nonsense", "type": "notatype", "n": 1, "action": "approve"}


class MessageButtons(Feature):
    details = MessageButtonsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(DropUnknownButtons(), expects=[
            Given(AnyEvent(type="message", n=1, action="created"), rows=(Message(n=1, title="Ready when you are", data={"buttons": [STARTS, NONSENSE]}),))
                >> Updated(Message(n=1), buttons=[STARTS]),
            Given(AnyEvent(type="message", n=2, action="created"), rows=(Message(n=2, title="Ready when you are", data={"buttons": [STARTS]}),))
                >> Unchanged(),
            Given(AnyEvent(type="todo", n=3, action="created"), rows=(Message(n=3, title="A row of a kind that carries no buttons", data={"buttons": [NONSENSE]}),))
                >> Unchanged(),
        ])
        journal.events.handler(AnswerInWords())

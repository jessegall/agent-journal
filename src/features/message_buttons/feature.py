from framework.base import Feature
from features.message_buttons.details import MessageButtonsDetails
from features.message_buttons.handlers import AnswerInWords, DropUnknownButtons
from framework.journal import Journal
from events.resources import AnyEvent, ResourceCreated
from expects import Given, Unchanged, Updated
from resources.base import AGENT, USER
from resources.types import Comment, Message, Todo

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
        journal.events.handler(AnswerInWords(), expects=[
            Given(ResourceCreated(type="comment", n=1, actor=USER), rows=(Comment(n=1, title="Not yet", brief="Not yet, wait for the gate.", refs=["message:3"]), Message(n=3, title="Ready when you are", data={"buttons": [STARTS]})))
                >> Updated(Message(n=3), answered_own="Not yet, wait for the gate."),
            Given(ResourceCreated(type="comment", n=1, actor=USER), rows=(Comment(n=1, title="Not yet", brief="Not yet", refs=["message:3"]), Message(n=3, title="Ready when you are", data={"buttons": [STARTS], "answered_own": "Earlier words"})))
                >> Unchanged(),
            Given(ResourceCreated(type="comment", n=1, actor=USER), rows=(Comment(n=1, title="Not yet", brief="Not yet", refs=["message:3"]), Message(n=3, title="Nothing to press")))
                >> Unchanged(),
            Given(ResourceCreated(type="comment", n=1, actor=AGENT), rows=(Comment(n=1, title="Waiting", brief="Waiting", refs=["message:3"]), Message(n=3, title="Ready when you are", data={"buttons": [STARTS]})))
                >> Unchanged(),
            Given(ResourceCreated(type="comment", n=1, actor=USER), rows=(Comment(n=1, title="Not yet", brief="Not yet", refs=["todo:3"]), Todo(n=3, title="A to-do carries no buttons")))
                >> Unchanged(),
        ])

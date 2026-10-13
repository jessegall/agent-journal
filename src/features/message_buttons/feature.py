from framework.base import Feature
from features.message_buttons.details import MessageButtonsDetails
from features.message_buttons.handlers import AnswerInWords, DropUnrunnableButtons
from features.message_buttons.listeners import SpotAnswerInOwnWords, SpotUnrunnableButtons
from events.message_buttons import AnsweredInOwnWords, ButtonsUnrunnable
from framework.journal import Journal
from events.resources import AnyEvent, ResourceCreated
from expects import Dispatches, Given, Updated, nothing
from resources.base import AGENT, USER
from resources.types import Comment, Doc, Message, Report, Todo

STARTS = {"label": "Okay, start", "type": "plan", "n": 3, "action": "approve"}
NONSENSE = {"label": "Nonsense", "type": "notatype", "n": 1, "action": "approve"}


class MessageButtons(Feature):
    details = MessageButtonsDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(AnyEvent, SpotUnrunnableButtons(), expects=[
            Given(AnyEvent(type="message", n=1, action="created"), rows=(Message(n=1, title="Ready when you are", data={"buttons": [STARTS, NONSENSE]}),))
                >> Dispatches(ButtonsUnrunnable(type="message", n=1, kept=[STARTS])),
            Given(AnyEvent(type="message", n=1, action="updated"), rows=(Message(n=1, title="Buttons put on afterwards", data={"buttons": [NONSENSE, STARTS]}),))
                >> Dispatches(ButtonsUnrunnable(type="message", n=1, kept=[STARTS])),
            Given(AnyEvent(type="message", n=2, action="created"), rows=(Message(n=2, title="Ready when you are", data={"buttons": [STARTS]}),))
                >> Dispatches(nothing),
            Given(AnyEvent(type="message", n=2, action="created"), rows=(Message(n=2, title="Nothing to press"),))
                >> Dispatches(nothing),
            Given(AnyEvent(type="todo", n=3, action="created"), rows=(Message(n=3, title="A row of a kind that carries no buttons", data={"buttons": [NONSENSE]}),))
                >> Dispatches(nothing),
            Given(AnyEvent(type="doc", n=2, action="created"), rows=(Doc(n=2, title="Plan", data={"buttons": [STARTS, NONSENSE]}),))
                >> Dispatches(ButtonsUnrunnable(type="doc", n=2, kept=[STARTS])),
            Given(AnyEvent(type="report", n=2, action="updated"), rows=(Report(n=2, title="Found", data={"buttons": [NONSENSE, STARTS]}),))
                >> Dispatches(ButtonsUnrunnable(type="report", n=2, kept=[STARTS])),
            Given(AnyEvent(type="message", n=1, action="completed"), rows=(Message(n=1, title="Closed", data={"buttons": [STARTS, NONSENSE]}),))
                >> Dispatches(nothing),
        ])
        journal.events.handle(ButtonsUnrunnable, DropUnrunnableButtons(), expects=[
            Given(ButtonsUnrunnable(type="message", n=1, kept=[STARTS]), rows=(Message(n=1, title="Ready when you are", data={"buttons": [STARTS, NONSENSE]}),))
                >> Updated(Message(n=1), buttons=[STARTS]),
            Given(ButtonsUnrunnable(type="doc", n=2, kept=[STARTS]), rows=(Doc(n=2, title="Plan", data={"buttons": [STARTS, NONSENSE]}),))
                >> Updated(Doc(n=2), buttons=[STARTS]),
            Given(ButtonsUnrunnable(type="report", n=2, kept=[STARTS]), rows=(Report(n=2, title="Found", data={"buttons": [STARTS, NONSENSE]}),))
                >> Updated(Report(n=2), buttons=[STARTS]),
        ])
        journal.events.listen(ResourceCreated, SpotAnswerInOwnWords(), expects=[
            Given(ResourceCreated(type="comment", n=1, actor=USER), rows=(Comment(n=1, title="Not yet", brief="Not yet, wait for the gate.", refs=["message:3"]), Message(n=3, title="Ready when you are", data={"buttons": [STARTS]})))
                >> Dispatches(AnsweredInOwnWords(type="message", n=3, words="Not yet, wait for the gate.")),
            Given(ResourceCreated(type="comment", n=1, actor=USER), rows=(Comment(n=1, title="Not yet", brief="Not yet", refs=["message:3"]), Message(n=3, title="Ready when you are", data={"buttons": [STARTS], "answered_own": "Earlier words"})))
                >> Dispatches(nothing),
            Given(ResourceCreated(type="comment", n=1, actor=USER), rows=(Comment(n=1, title="Not yet", brief="Not yet", refs=["message:3"]), Message(n=3, title="Nothing to press")))
                >> Dispatches(nothing),
            Given(ResourceCreated(type="comment", n=1, actor=AGENT), rows=(Comment(n=1, title="Waiting", brief="Waiting", refs=["message:3"]), Message(n=3, title="Ready when you are", data={"buttons": [STARTS]})))
                >> Dispatches(nothing),
            Given(ResourceCreated(type="comment", n=1, actor=USER), rows=(Comment(n=1, title="Not yet", brief="Not yet", refs=["todo:3"]), Todo(n=3, title="A to-do carries no buttons")))
                >> Dispatches(nothing),
            Given(ResourceCreated(type="comment", n=1, actor=USER), rows=(Comment(n=1, title="Not yet", brief="Not yet", refs=["doc:3"]), Doc(n=3, title="Plan", data={"buttons": [STARTS]})))
                >> Dispatches(AnsweredInOwnWords(type="doc", n=3, words="Not yet")),
            Given(ResourceCreated(type="comment", n=1, actor=USER), rows=(Comment(n=1, title="Not yet", brief="Not yet", refs=["report:3"]), Report(n=3, title="Found", data={"buttons": [STARTS]})))
                >> Dispatches(AnsweredInOwnWords(type="report", n=3, words="Not yet")),
            Given(ResourceCreated(type="comment", n=1, actor=USER), rows=(Comment(n=1, title="Wait", brief="", refs=["message:3"]), Message(n=3, title="Ready when you are", data={"buttons": [STARTS]})))
                >> Dispatches(AnsweredInOwnWords(type="message", n=3, words="Wait")),
            Given(ResourceCreated(type="comment", n=1, actor=USER), rows=(Comment(n=1, title="Not yet", brief="Not yet", refs=["message:last"]),))
                >> Dispatches(nothing),
            Given(ResourceCreated(type="comment", n=1, actor=USER), rows=(Comment(n=1, title="Not yet", brief="Not yet", refs=["message:3"]), Message(n=3, title="Ready when you are", data={"buttons": [STARTS], "pressed": ["Okay, start"]})))
                >> Dispatches(nothing),
            Given(ResourceCreated(type="message", n=1, actor=USER), rows=(Message(n=1, title="Hello", data={"buttons": [STARTS]}),))
                >> Dispatches(nothing),
            Given(ResourceCreated(type="comment", n=1, actor=USER), rows=(Comment(n=1, title="Both", brief="Both", refs=["message:3", "doc:4"]), Message(n=3, title="Ready when you are", data={"buttons": [STARTS]}), Doc(n=4, title="Plan", data={"buttons": [STARTS]})))
                >> Dispatches(AnsweredInOwnWords(type="message", n=3, words="Both")) & Dispatches(AnsweredInOwnWords(type="doc", n=4, words="Both")),
        ])
        journal.events.handle(AnsweredInOwnWords, AnswerInWords(), expects=[
            Given(AnsweredInOwnWords(type="message", n=3, words="Not yet, wait for the gate."), rows=(Message(n=3, title="Ready when you are", data={"buttons": [STARTS]}),))
                >> Updated(Message(n=3), answered_own="Not yet, wait for the gate."),
            Given(AnsweredInOwnWords(type="doc", n=3, words="Not yet"), rows=(Doc(n=3, title="Plan", data={"buttons": [STARTS]}),))
                >> Updated(Doc(n=3), answered_own="Not yet"),
            Given(AnsweredInOwnWords(type="report", n=3, words="Not yet"), rows=(Report(n=3, title="Found", data={"buttons": [STARTS]}),))
                >> Updated(Report(n=3), answered_own="Not yet"),
        ])

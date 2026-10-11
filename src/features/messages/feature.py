from controllers.types import Messages
from engine.events.agents import AgentReported
from engine.events.engine import AgentMessageSent
from engine.events.resources import MessageUpdated, ResourceCreated
from expects import Given, Nudged, Unchanged, Updated, Wrote
from features.base import Feature
from features.journal import Journal
from features.messages.details import MessagesDetails
from features.messages.formatters import CommandsAsCode
from features.messages.closing import CloseAnswered, CloseHandled, CloseProcessed, CloseSeenByUser
from features.messages.inbox import NameUnanswered, NameUnread, ResetCountsOnArrival
from features.messages.prose import NameBareNumbers, NameRunTogether
from features.messages.answering import unanswered
from features.messages.saving import SaveAgentMessage
from features.triggers.watched import FACTS, state_facts
from resources.base import AGENT, USER
from resources.types import AgentRow, Comment, Message, Reaction, Todo


IDLE = AgentRow(n=1, title="claude-1", data={"status": "idle"})
LATER = AgentRow(n=1, title="claude-1", data={"status": "idle", "uses": 3})
WORKING = AgentRow(n=1, title="claude-1", data={"status": "working"})


def wrote(title: str, seen: tuple = (USER,), **fields) -> Message:
    return Message(n=5, title=title, seen=list(seen), **fields)


def asked(title: str = "What do you think about the plan?", **fields) -> Message:
    return wrote(title, seen=(USER, AGENT), **fields)


def reply(author: str = AGENT) -> Comment:
    return Comment(n=1, title="Here is my view", refs=["message:5"], seen=[author])


def reaction(author: str = AGENT) -> Reaction:
    return Reaction(n=1, title="👍", refs=["message:5"], seen=[author])


def reported() -> AgentReported:
    return AgentReported(agent=1)


def said(text: str, turn: str = "turn-1") -> AgentMessageSent:
    return AgentMessageSent(agent=1, text=text, turn=turn)


def touched(*numbers: int) -> MessageUpdated:
    return MessageUpdated(n=numbers[0], type="message", action="updated", actor=USER, numbers=numbers)


def created(kind: str, actor: str = AGENT) -> ResourceCreated:
    return ResourceCreated(n=1, type=kind, action="created", actor=actor)


SENT = wrote("Closed it earlier", seen=(AGENT,))


class MessagesFeature(Feature):
    details = MessagesDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(SaveAgentMessage(), expects=[
            Given(said("Done, it is filed."), rows=[IDLE]) >> Wrote(Message(title="Done, it is filed.", brief="Done, it is filed.")),
            Given(said("   "), rows=[IDLE]) >> Unchanged(),
            Given(said("👍"), rows=[IDLE]) >> Nudged("reaction"),
        ])
        journal.events.handler(ResetCountsOnArrival())
        journal.events.handler(NameUnread(), expects=[
            Given(reported(), rows=[wrote("Can you look at this?"), LATER]) >> Nudged("inbox"),
            Given(reported(), rows=[wrote("Can you look at this?"), IDLE]) >> Unchanged(),
            Given(reported(), rows=[wrote("Can you look at this?"), WORKING]) >> Unchanged(),
            Given(reported(), rows=[asked("Can you look at this?"), IDLE]) >> Unchanged(),
            Given(reported(), rows=[wrote("Here is the result", seen=(AGENT,)), IDLE]) >> Unchanged(),
            Given(reported(), rows=[IDLE]) >> Unchanged(),
        ])
        journal.events.handler(NameUnanswered(), expects=[
            Given(reported(), rows=[asked(), IDLE]) >> Nudged("answer"),
            Given(reported(), rows=[asked(), reply(), IDLE]) >> Unchanged(),
            Given(reported(), rows=[asked(), reaction(), IDLE]) >> Nudged("answer"),
            Given(reported(), rows=[asked("Please file the report", refs=["todo:7"]), IDLE]) >> Unchanged(),
            Given(reported(), rows=[asked(refs=["todo:7"]), IDLE]) >> Nudged("answer"),
            Given(reported(), rows=[asked("Here is the result"), IDLE]) >> Nudged("answer"),
            Given(reported(), rows=[wrote("What do you think about the plan?"), IDLE]) >> Unchanged(),
            Given(reported(), rows=[wrote("Here is the plan", seen=(AGENT, USER)), IDLE]) >> Unchanged(),
            Given(reported(), rows=[IDLE]) >> Unchanged(),
        ])
        journal.events.handler(CloseHandled(), expects=[
            Given(reported(), rows=[asked("Please file the report", refs=["todo:7"]), IDLE]) >> Updated(Message(n=5), outcome="handled: todo:7"),
            Given(reported(), rows=[asked("Please file the report", refs=["todo:7"]), WORKING]) >> Unchanged(),
            Given(reported(), rows=[asked(refs=["todo:7"]), IDLE]) >> Unchanged(),
            Given(reported(), rows=[asked(refs=["todo:7"]), reply(), IDLE]) >> Updated(Message(n=5), outcome="handled: todo:7"),
            Given(reported(), rows=[wrote("Please file the report", refs=["todo:7"]), IDLE]) >> Unchanged(),
            Given(reported(), rows=[asked("Please file the report"), IDLE]) >> Unchanged(),
        ])
        journal.events.handler(CloseSeenByUser(), expects=[
            Given(touched(5), rows=[wrote("Done, it is filed.", seen=(AGENT, USER)), IDLE]) >> Updated(Message(n=5), outcome="read by the user"),
            Given(touched(5), rows=[wrote("Done, it is filed.", seen=(AGENT,)), IDLE]) >> Unchanged(),
            Given(touched(5), rows=[wrote("Please look at this", seen=(USER, AGENT)), IDLE]) >> Unchanged(),
        ])
        journal.events.handler(CloseProcessed(), expects=[
            Given(touched(5), rows=[asked("Please file the report", refs=["todo:7"]), IDLE]) >> Updated(Message(n=5), outcome="handled: todo:7"),
            Given(touched(5), rows=[asked(refs=["todo:7"]), IDLE]) >> Unchanged(),
            Given(touched(5), rows=[asked("Please file the report"), IDLE]) >> Unchanged(),
            Given(touched(5), rows=[wrote("Please file the report", refs=["todo:7"]), IDLE]) >> Unchanged(),
            Given(touched(5), rows=[asked("Please file the report", refs=["todo:7"], completed=1.0), IDLE]) >> Unchanged(),
        ])
        journal.events.handler(CloseAnswered(), expects=[
            Given(created("comment"), rows=[asked(), reply(), IDLE]) >> Updated(Message(n=5), outcome="answered by the agent"),
            Given(created("reaction"), rows=[asked("Here is the result"), reaction(), IDLE]) >> Updated(Message(n=5), outcome="acknowledged by the agent"),
            Given(created("reaction"), rows=[asked(), reaction(), IDLE]) >> Unchanged(),
            Given(created("comment", actor=USER), rows=[asked(), reply(USER), IDLE]) >> Unchanged(),
            Given(created("comment"), rows=[wrote("Done, it is filed.", seen=(AGENT,)), reply(), IDLE]) >> Unchanged(),
            Given(created("todo"), rows=[asked(), Todo(n=1, title="Row"), IDLE]) >> Unchanged(),
        ])
        journal.events.handler(NameRunTogether())
        journal.events.handler(NameBareNumbers(), expects=[
            Given(said("I closed 482 for you."), rows=[SENT, Todo(n=482, title="Row"), IDLE]) >> Nudged("numbers"),
            Given(said("I closed `482` for you."), rows=[SENT, Todo(n=482, title="Row"), IDLE]) >> Unchanged(),
            Given(said("I closed to-do 482 for you."), rows=[SENT, Todo(n=482, title="Row"), IDLE]) >> Unchanged(),
            Given(said("It took 482 ms to load."), rows=[SENT, Todo(n=482, title="Row"), IDLE]) >> Unchanged(),
            Given(said("The server answered 500."), rows=[SENT, Todo(n=500, title="Row"), IDLE]) >> Unchanged(),
            Given(said("I closed 482 for you."), rows=[SENT, IDLE]) >> Unchanged(),
            Given(said("I closed 482 for you."), rows=[Todo(n=482, title="Row"), IDLE]) >> Unchanged(),
            Given(said("I have nothing to add."), rows=[SENT, Todo(n=482, title="Row"), IDLE]) >> Unchanged(),
        ])
        journal.client.formatter(CommandsAsCode())
        FACTS.register(self, *state_facts("message", "unread", lambda context: context.journal.get(Messages).unread(AGENT)),
                       *state_facts("message", "unanswered", lambda context: unanswered(context.journal)))

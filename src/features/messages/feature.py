from controllers.types import Messages
from events.agents import AgentReported
from events.agents import AgentMessageSent
from events.resources import ResourceCreated
from events.messages import MessageCreated, MessageUpdated
import json
from dataclasses import asdict, replace

from expects import Formats, Given, Nudged, Remembered, Unchanged, Updated, Wrote
from declaring.trigger import Mark
from framework.base import Feature
from framework.journal import Journal
from features.messages.details import MessagesDetails
from features.messages.formatters import CommandsAsCode
from features.messages.closing import CloseAnswered, CloseHandled, CloseProcessed, CloseSeenByUser
from features.messages.inbox import NameUnanswered, NameUnread, ResetCountsOnArrival
from features.messages.prose import NameBareNumbers, NameRunTogether
from features.messages.answering import unanswered
from features.messages.saving import SaveAgentMessage
from framework.watched import FACTS, state_facts
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


ABOUT_A_TODO = asked(refs=["todo:7"])
FILE_THE_REPORT = replace(ABOUT_A_TODO, title="Please file the report")
FILE_THE_REPORT_WRITTEN = replace(FILE_THE_REPORT, seen=[USER])


def after_report(*rows) -> Given:
    return Given.of(reported(), *rows)


def after_touch(*rows) -> Given:
    return Given.of(touched(5), *rows)


def after_creating(kind: str, *rows) -> Given:
    return Given.of(ResourceCreated.of(kind), *rows)


def in_a_transcript(text: str) -> str:
    return json.dumps({"type": "assistant", "timestamp": "2026-01-01T00:00:00+00:00", "message": {"content": [{"type": "text", "text": text}]}}) + "\n"


CLAUDE = AgentRow(n=1, title="claude-1", data={"provider": "claude"})
RAN_ON = "This is a sentence. " * 25

SENT = wrote("Closed it earlier", seen=(AGENT,))


class MessagesFeature(Feature):
    details = MessagesDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(SaveAgentMessage(), expects=[
            Given.of(said("Done, it is filed."), IDLE) >> Wrote(Message(title="Done, it is filed.", brief="Done, it is filed.")),
            Given.of(said("   "), IDLE) >> Unchanged(),
            Given.of(said("👍"), IDLE) >> Nudged("reaction"),
        ])
        journal.events.handler(ResetCountsOnArrival(), expects=[
            Given.of(MessageCreated(n=7, type="message", action="created", actor=USER), AgentRow(n=1, title="claude-1", data={"uses": 10}))
                >> Remembered("trigger-messages.unread", asdict(Mark(uses=7))) & Remembered("trigger-messages.answering", asdict(Mark(uses=10))),
            Given(MessageCreated(n=7, type="message", action="created", actor=USER)) >> Unchanged(),
        ])
        journal.events.handler(NameUnread(), expects=[
            after_report(wrote("Can you look at this?"), LATER) >> Nudged("inbox"),
            after_report(wrote("Can you look at this?"), IDLE) >> Unchanged(),
            after_report(wrote("Can you look at this?"), WORKING) >> Unchanged(),
            after_report(asked("Can you look at this?"), IDLE) >> Unchanged(),
            after_report(wrote("Here is the result", seen=(AGENT,)), IDLE) >> Unchanged(),
            after_report(IDLE) >> Unchanged(),
        ])
        journal.events.handler(NameUnanswered(), expects=[
            after_report(asked(), IDLE) >> Nudged("answer"),
            after_report(asked(), reply(), IDLE) >> Unchanged(),
            after_report(asked(), reaction(), IDLE) >> Nudged("answer"),
            after_report(FILE_THE_REPORT, IDLE) >> Unchanged(),
            after_report(ABOUT_A_TODO, IDLE) >> Nudged("answer"),
            after_report(asked("Here is the result"), IDLE) >> Nudged("answer"),
            after_report(wrote("What do you think about the plan?"), IDLE) >> Unchanged(),
            after_report(wrote("Here is the plan", seen=(AGENT, USER)), IDLE) >> Unchanged(),
            after_report(IDLE) >> Unchanged(),
        ])
        journal.events.handler(CloseHandled(), expects=[
            after_report(FILE_THE_REPORT, IDLE) >> Updated(Message(n=5), outcome="handled: todo:7"),
            after_report(FILE_THE_REPORT, WORKING) >> Unchanged(),
            after_report(ABOUT_A_TODO, IDLE) >> Unchanged(),
            after_report(ABOUT_A_TODO, reply(), IDLE) >> Updated(Message(n=5), outcome="handled: todo:7"),
            after_report(FILE_THE_REPORT_WRITTEN, IDLE) >> Unchanged(),
            after_report(asked("Please file the report"), IDLE) >> Unchanged(),
        ])
        journal.events.handler(CloseSeenByUser(), expects=[
            after_touch(wrote("Done, it is filed.", seen=(AGENT, USER)), IDLE) >> Updated(Message(n=5), outcome="read by the user"),
            after_touch(wrote("Done, it is filed.", seen=(AGENT,)), IDLE) >> Unchanged(),
            after_touch(wrote("Please look at this", seen=(USER, AGENT)), IDLE) >> Unchanged(),
        ])
        journal.events.handler(CloseProcessed(), expects=[
            after_touch(FILE_THE_REPORT, IDLE) >> Updated(Message(n=5), outcome="handled: todo:7"),
            after_touch(ABOUT_A_TODO, IDLE) >> Unchanged(),
            after_touch(asked("Please file the report"), IDLE) >> Unchanged(),
            after_touch(FILE_THE_REPORT_WRITTEN, IDLE) >> Unchanged(),
            after_touch(asked("Please file the report", refs=["todo:7"], completed=1.0), IDLE) >> Unchanged(),
        ])
        journal.events.handler(CloseAnswered(), expects=[
            after_creating("comment", asked(), reply(), IDLE) >> Updated(Message(n=5), outcome="answered by the agent"),
            after_creating("reaction", asked("Here is the result"), reaction(), IDLE) >> Updated(Message(n=5), outcome="acknowledged by the agent"),
            after_creating("reaction", asked(), reaction(), IDLE) >> Unchanged(),
            Given.of(ResourceCreated.of("comment", actor=USER), asked(), reply(USER), IDLE) >> Unchanged(),
            after_creating("comment", wrote("Done, it is filed.", seen=(AGENT,)), reply(), IDLE) >> Unchanged(),
            after_creating("todo", asked(), Todo(n=1, title="Row"), IDLE) >> Unchanged(),
        ])
        journal.events.handler(NameRunTogether(), expects=[
            Given(reported(), rows=[CLAUDE], transcript=in_a_transcript(RAN_ON)) >> Nudged("paragraphs"),
            Given(reported(), rows=[CLAUDE], transcript=in_a_transcript("This is a sentence.")) >> Unchanged(),
            Given(reported(), rows=[CLAUDE], transcript=in_a_transcript(RAN_ON.replace(". ", ".\n\n", 1))) >> Unchanged(),
        ])
        journal.events.handler(NameBareNumbers(), expects=[
            Given.of(said("I closed 482 for you."), SENT, Todo(n=482, title="Row"), IDLE) >> Nudged("numbers"),
            Given.of(said("I closed `482` for you."), SENT, Todo(n=482, title="Row"), IDLE) >> Unchanged(),
            Given.of(said("I closed to-do 482 for you."), SENT, Todo(n=482, title="Row"), IDLE) >> Unchanged(),
            Given.of(said("It took 482 ms to load."), SENT, Todo(n=482, title="Row"), IDLE) >> Unchanged(),
            Given.of(said("The server answered 500."), SENT, Todo(n=500, title="Row"), IDLE) >> Unchanged(),
            Given.of(said("I closed 482 for you."), SENT, IDLE) >> Unchanged(),
            Given.of(said("I closed 482 for you."), Todo(n=482, title="Row"), IDLE) >> Unchanged(),
            Given.of(said("I have nothing to add."), SENT, Todo(n=482, title="Row"), IDLE) >> Unchanged(),
        ])
        journal.client.formatter(CommandsAsCode(), expects=[
            Formats("Run journal todo create to file it", to="Run `journal todo create` to file it"),
            Formats("Pass --force to push", to="Pass `--force` to push"),
            Formats("Run `journal todo create` to file it", to="Run `journal todo create` to file it"),
            Formats("Edit src/--force.py now", to="Edit src/--force.py now"),
            Formats("Nothing to quote here", to="Nothing to quote here"),
        ])
        FACTS.register(self, *state_facts("message", "unread", lambda context: context.journal.get(Messages).unread(AGENT)),
                       *state_facts("message", "unanswered", lambda context: unanswered(context.journal)))

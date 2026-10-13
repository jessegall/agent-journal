from controllers.types import Messages
from events.agents import AgentReported
from events.agents import AgentMessageSent
from events.resources import ResourceCreated
from events.answers import Rewritten
from events.asking import TextFormatting
from events.messages import (AnswerHeld, AnswerOwed, AnswerRearmed, AnswersSettled, AnswerWaitBegan, BareNumbersNamed, FaceSent, InboxRearmed, InboxSettled, InboxUnread,
                             MessageCreated, MessageSettled, MessageUpdated, RunTogether, TurnToPost)
import json
from dataclasses import asdict, replace

from expects import Answered, Dispatches, Given, Held, Nudged, Remembered, Updated, Wrote, answering, nothing
from declaring.trigger import Mark
from framework.base import Feature
from framework.journal import Journal
from features.messages.details import MessagesDetails
from features.messages.formatters import CommandsAsCode
from features.messages.handlers import (BeginAnswerWait, CloseTheMessage, HoldUntilAnswered, NameBareNumbers, NameFace, NameInbox, NameRunTogether, NameUnanswered, PostTurn,
                                        RearmAnswering, RearmInbox, ReleaseAnswering, ReleaseInbox)
from features.messages.listeners import (SpotArrival, SpotBareNumbers, SpotMessagesAnswered, SpotMessagesHandled, SpotMessagesProcessed, SpotMessagesSeenByUser, SpotRunTogether,
                                         SpotTurnToPost, SpotUnanswered, SpotUnread)
from features.messages.answering import unanswered_in
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


def marked(name: str, **fields) -> dict:
    """The mark file the agent's triggers left for this name, as the play stages it before the registration runs."""
    return {f".journal/runtime/sessions/claude-1/trigger-{name}.json": json.dumps(asdict(Mark(**fields)))}


def after_report(*rows, **more) -> Given:
    return Given.of(reported(), *rows, **more)


def after_touch(*rows) -> Given:
    return Given.of(touched(5), *rows)


def after_creating(kind: str, *rows) -> Given:
    return Given.of(ResourceCreated.of(kind), *rows)


def in_a_transcript(text: str) -> str:
    return json.dumps({"type": "assistant", "timestamp": "2026-01-01T00:00:00+00:00", "message": {"content": [{"type": "text", "text": text}]}}) + "\n"


CLAUDE = AgentRow(n=1, title="claude-1", data={"provider": "claude"})
RAN_ON = "This is a sentence. " * 25

SENT = wrote("Closed it earlier", seen=(AGENT,))

OWED = AnswerOwed(agent=1, messages="message 5", numbers=(5,), rows=("message:5",))


class MessagesFeature(Feature):
    details = MessagesDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(AgentMessageSent, SpotTurnToPost(), expects=[
            Given.of(said("Done, it is filed."), IDLE) >> Dispatches(TurnToPost(agent=1, text="Done, it is filed.", turn="turn-1").once("turn-1")),
            Given.of(said("   "), IDLE) >> Dispatches(nothing),
            Given.of(said("👍"), IDLE) >> Dispatches(FaceSent(agent=1, face="👍").once("turn-1")),
        ])
        journal.events.listen(MessageCreated, SpotArrival(), expects=[
            Given.of(MessageCreated(n=7, type="message", action="created", actor=USER), AgentRow(n=1, title="claude-1", data={"uses": 10}))
                >> Dispatches(InboxRearmed(agent=1, uses=10)) & Dispatches(AnswerRearmed(agent=1, uses=10)),
            Given(MessageCreated(n=7, type="message", action="created", actor=USER)) >> Dispatches(nothing),
            Given.of(MessageCreated(n=7, type="message", action="created", actor=USER), AgentRow(n=1, title="claude-1", data={"status": "stopped", "uses": 10})) >> Dispatches(nothing),
        ])
        journal.events.listen(AgentReported, SpotUnread(), expects=[
            after_report(wrote("Can you look at this?"), LATER) >> Dispatches(InboxUnread(agent=1).due("unread")),
            after_report(wrote("Can you look at this?"), IDLE) >> Dispatches(InboxUnread(agent=1).due("unread")),
            after_report(wrote("Can you look at this?"), WORKING) >> Dispatches(InboxSettled(agent=1)),
            after_report(asked("Can you look at this?"), IDLE) >> Dispatches(InboxSettled(agent=1)),
            after_report(wrote("Here is the result", seen=(AGENT,)), IDLE) >> Dispatches(InboxSettled(agent=1)),
            after_report(IDLE) >> Dispatches(InboxSettled(agent=1)),
        ])
        journal.events.listen(AgentReported, SpotUnanswered(), expects=[
            after_report(asked(), IDLE) >> Dispatches(AnswerWaitBegan(agent=1, uses=1)) & Dispatches(OWED),
            after_report(asked(), reply(), IDLE) >> Dispatches(AnswersSettled(agent=1)),
            after_report(asked(), reaction(), IDLE) >> Dispatches(OWED),
            after_report(FILE_THE_REPORT, IDLE) >> Dispatches(AnswersSettled(agent=1)),
            after_report(ABOUT_A_TODO, IDLE) >> Dispatches(OWED),
            after_report(asked("Here is the result"), IDLE) >> Dispatches(OWED),
            after_report(asked(), AgentRow(n=1, title="claude-1", data={"status": "working", "uses": 13}), files=answering(marked("messages.answer hold", uses=3)))
                >> Dispatches(AnswerHeld(agent=1, messages="message 5")) & Dispatches(OWED.due("answering")),
            after_report(wrote("What do you think about the plan?"), IDLE) >> Dispatches(AnswersSettled(agent=1)),
            after_report(wrote("Here is the plan", seen=(AGENT, USER)), IDLE) >> Dispatches(AnswersSettled(agent=1)),
            after_report(IDLE) >> Dispatches(AnswersSettled(agent=1)),
        ])
        journal.events.listen(AgentReported, SpotMessagesHandled(), expects=[
            after_report(FILE_THE_REPORT, IDLE) >> Dispatches(MessageSettled(n=5, how="handled: todo:7")),
            after_report(FILE_THE_REPORT, WORKING) >> Dispatches(nothing),
            after_report(ABOUT_A_TODO, IDLE) >> Dispatches(nothing),
            after_report(ABOUT_A_TODO, reply(), IDLE) >> Dispatches(MessageSettled(n=5, how="handled: todo:7")),
            after_report(FILE_THE_REPORT_WRITTEN, IDLE) >> Dispatches(nothing),
            after_report(asked("Please file the report"), IDLE) >> Dispatches(nothing),
        ])
        journal.events.listen(MessageUpdated, SpotMessagesSeenByUser(), expects=[
            after_touch(wrote("Done, it is filed.", seen=(AGENT, USER)), IDLE) >> Dispatches(MessageSettled(n=5, how="read by the user")),
            after_touch(wrote("Done, it is filed.", seen=(AGENT,)), IDLE) >> Dispatches(nothing),
            after_touch(wrote("Please look at this", seen=(USER, AGENT)), IDLE) >> Dispatches(nothing),
        ])
        journal.events.listen(MessageUpdated, SpotMessagesProcessed(), expects=[
            after_touch(FILE_THE_REPORT, IDLE) >> Dispatches(MessageSettled(n=5, how="handled: todo:7")),
            after_touch(ABOUT_A_TODO, IDLE) >> Dispatches(nothing),
            after_touch(asked("Please file the report"), IDLE) >> Dispatches(nothing),
            after_touch(FILE_THE_REPORT_WRITTEN, IDLE) >> Dispatches(nothing),
            after_touch(asked("Please file the report", refs=["todo:7"], completed=1.0), IDLE) >> Dispatches(nothing),
        ])
        journal.events.listen(ResourceCreated, SpotMessagesAnswered(), expects=[
            after_creating("comment", asked(), reply(), IDLE) >> Dispatches(MessageSettled(n=5, how="answered by the agent")),
            after_creating("reaction", asked("Here is the result"), reaction(), IDLE) >> Dispatches(MessageSettled(n=5, how="acknowledged by the agent")),
            after_creating("reaction", asked(), reaction(), IDLE) >> Dispatches(nothing),
            Given.of(ResourceCreated.of("comment", actor=USER), asked(), reply(USER), IDLE) >> Dispatches(nothing),
            after_creating("comment", wrote("Done, it is filed.", seen=(AGENT,)), reply(), IDLE) >> Dispatches(nothing),
            after_creating("todo", asked(), Todo(n=1, title="Row"), IDLE) >> Dispatches(nothing),
        ])
        journal.events.listen(AgentReported, SpotRunTogether(), expects=[
            Given(reported(), rows=[CLAUDE], transcript=in_a_transcript(RAN_ON)) >> Dispatches(RunTogether(agent=1)),
            Given(reported(), rows=[CLAUDE], transcript=in_a_transcript("This is a sentence.")) >> Dispatches(nothing),
            Given(reported(), rows=[CLAUDE], transcript=in_a_transcript(RAN_ON.replace(". ", ".\n\n", 1))) >> Dispatches(nothing),
        ])
        journal.events.listen(AgentMessageSent, SpotBareNumbers(), expects=[
            Given.of(said("I closed 482 for you."), SENT, Todo(n=482, title="Row"), IDLE) >> Dispatches(BareNumbersNamed(agent=1, n=5, numbers="482")),
            Given.of(said("I closed `482` for you."), SENT, Todo(n=482, title="Row"), IDLE) >> Dispatches(nothing),
            Given.of(said("I closed to-do 482 for you."), SENT, Todo(n=482, title="Row"), IDLE) >> Dispatches(nothing),
            Given.of(said("It took 482 ms to load."), SENT, Todo(n=482, title="Row"), IDLE) >> Dispatches(nothing),
            Given.of(said("The server answered 500."), SENT, Todo(n=500, title="Row"), IDLE) >> Dispatches(nothing),
            Given.of(said("I closed 482 for you."), SENT, IDLE) >> Dispatches(nothing),
            Given.of(said("I closed 482 for you."), Todo(n=482, title="Row"), IDLE) >> Dispatches(nothing),
            Given.of(said("I have nothing to add."), SENT, Todo(n=482, title="Row"), IDLE) >> Dispatches(nothing),
        ])
        journal.events.handle(TurnToPost, PostTurn(), expects=[
            Given.of(TurnToPost(agent=1, text="Done, it is filed.", turn="turn-1"), IDLE) >> Wrote(Message(title="Done, it is filed.", brief="Done, it is filed.")),
        ])
        journal.events.handle(FaceSent, NameFace(), expects=[
            Given.of(FaceSent(agent=1, face="👍"), IDLE) >> Nudged("reaction", face="👍"),
        ])
        journal.events.handle(InboxRearmed, RearmInbox(), expects=[
            Given.of(InboxRearmed(agent=1, uses=10), AgentRow(n=1, title="claude-1", data={"uses": 10})) >> Remembered("trigger-messages.unread", asdict(Mark(uses=7))),
        ])
        journal.events.handle(AnswerRearmed, RearmAnswering(), expects=[
            Given.of(AnswerRearmed(agent=1, uses=10), AgentRow(n=1, title="claude-1", data={"uses": 10})) >> Remembered("trigger-messages.answering", asdict(Mark(uses=10))),
        ])
        journal.events.handle(InboxSettled, ReleaseInbox(), expects=[
            Given.of(InboxSettled(agent=1), IDLE) >> Dispatches(nothing),
            Given.of(InboxSettled(agent=1), IDLE, files=answering(marked("messages.unread", count=3))) >> Remembered("trigger-messages.unread", asdict(Mark())),
        ])
        journal.events.handle(InboxUnread, NameInbox(), expects=[
            Given.of(InboxUnread(agent=1), LATER) >> Nudged("inbox") & Remembered("trigger-messages.unread", asdict(Mark(count=1))),
            Given.of(InboxUnread(agent=1), LATER, settings={"messages.unread.patience": 0})
                >> Nudged("inbox") & Held("your inbox is unread: journal message unread, then journal message read <n> for each, before any other write"),
            Given.of(InboxUnread(agent=1), LATER, files=answering(marked("messages.unread", count=5)))
                >> Nudged("inbox") & Held("your inbox is unread: journal message unread, then journal message read <n> for each, before any other write")
                & Remembered("trigger-messages.unread", asdict(Mark(count=6))),
        ])
        journal.events.handle(AnswersSettled, ReleaseAnswering(), expects=[
            Given.of(AnswersSettled(agent=1), IDLE) >> Dispatches(nothing),
            Given.of(AnswersSettled(agent=1), IDLE, files=answering({**marked("messages.answering", count=2), **marked("messages.answer hold", uses=5)}))
                >> Remembered("trigger-messages.answering", asdict(Mark())) & Remembered("trigger-messages.answer hold", asdict(Mark())),
        ])
        journal.events.handle(AnswerWaitBegan, BeginAnswerWait(), expects=[
            Given.of(AnswerWaitBegan(agent=1, uses=3), LATER) >> Remembered("trigger-messages.answer hold", asdict(Mark(uses=3))),
        ])
        journal.events.handle(AnswerHeld, HoldUntilAnswered(), expects=[
            Given.of(AnswerHeld(agent=1, messages="message 5"), LATER) >> Held("your tool calls are held: answer message 5 first"),
        ])
        journal.events.handle(AnswerOwed, NameUnanswered(), expects=[
            Given.of(OWED, IDLE) >> Nudged("answer", messages="message 5") & Remembered("trigger-messages.answering", asdict(Mark(count=1))),
            Given.of(OWED, IDLE, settings={"messages.answering.patience": 0})
                >> Remembered("trigger-messages.answering", asdict(Mark(count=1))),
            Given.of(AnswerOwed(agent=1, messages="message 5", numbers=(5,), rows=("message:5",)), IDLE, files=answering(marked("messages.answering", count=3)))
                >> Remembered("trigger-messages.answering", asdict(Mark(count=4))),
        ])
        journal.events.handle(MessageSettled, CloseTheMessage(), expects=[
            Given.of(MessageSettled(n=5, how="handled: todo:7"), asked(refs=["todo:7"]), IDLE) >> Updated(Message(n=5), outcome="handled: todo:7"),
            Given.of(MessageSettled(n=5, how="read by the user"), SENT, IDLE) >> Updated(Message(n=5), outcome="read by the user"),
        ])
        journal.events.handle(RunTogether, NameRunTogether(), expects=[
            Given.of(RunTogether(agent=1), IDLE) >> Nudged("paragraphs"),
        ])
        journal.events.handle(BareNumbersNamed, NameBareNumbers(), expects=[
            Given.of(BareNumbersNamed(agent=1, n=5, numbers="482"), IDLE) >> Nudged("numbers", n=5, numbers="482"),
        ])
        journal.events.answer(TextFormatting, CommandsAsCode(), expects=[
            Given(TextFormatting(text="Run journal todo create to file it")) >> Answered(Rewritten("Run `journal todo create` to file it")),
            Given(TextFormatting(text="Pass --force to push")) >> Answered(Rewritten("Pass `--force` to push")),
            Given(TextFormatting(text="Run `journal todo create` to file it")) >> Answered(Rewritten("Run `journal todo create` to file it")),
            Given(TextFormatting(text="Edit src/--force.py now")) >> Answered(Rewritten("Edit src/--force.py now")),
            Given(TextFormatting(text="Nothing to quote here")) >> Answered(Rewritten("Nothing to quote here")),
        ])
        FACTS.register(self, *state_facts("message", "unread", lambda context: context.journal.get(Messages).unread(AGENT)),
                       *state_facts("message", "unanswered", lambda context: unanswered_in(context.journal)))

from controllers.types import Messages
from expects.staged import in_a_transcript
from events.agents import AgentReported, ChunkDisplayed, ToolFinished, TurnInterrupted, TurnStopped
from events.agents import AgentMessageSent
from events.resources import ResourceCreated
from events.answers import Rewritten
from events.asking import TextFormatting
from events.messages import (FallbackHeld, FaultWindowOver, MessageDisplayed, PromptBegan, TurnCutOff, TurnEnded, AnswerHeld, AnswerOwed, AnswerRearmed, AnswersSettled, AnswerWaitBegan, BareNumbersNamed, FaceSent, InboxRearmed, InboxSettled, InboxUnread,
                             MessageCreated, MessageSettled, MessagesReadByUser, MessageUpdated, RunTogether, TurnToPost)
import json
from dataclasses import asdict, replace

from expects import WHEN, Answered, File, Ran, Unchanged, Dispatches, Given, Held, Nudged, Remembered, Updated, Wrote, answering, nothing
from declaring.trigger import Mark
from framework.base import Feature
from framework.displayed import FELL_BACK, HELD_FOR, SETTLE, fingerprint
from framework.journal import Journal
from features.messages.details import MessagesDetails
from features.messages.formatters import CommandsAsCode
from features.messages.handlers import (BeginTurn, CatchUpAfterTool, CatchUpAfterTurn, HoldFallbackFault, KeepChunk, PostCutOffTurn, PostDisplayed, RaiseHeldFaults, SendCutOffWords, BeginAnswerWait, CloseReadMessages, CloseTheMessage, HoldUntilAnswered, NameBareNumbers, NameFace, NameInbox, NameRunTogether, NameUnanswered, PostTurn,
                                        RearmAnswering, RearmInbox, ReleaseAnswering, ReleaseInbox)
from features.messages.listeners import (SpotCutOff, SpotPrompt, SpotTurnEnd, SpotArrival, SpotBareNumbers, SpotMessagesAnswered, SpotMessagesHandled, SpotMessagesProcessed, SpotMessagesSeenByUser, SpotRunTogether,
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


def after_report(*rows, **more) -> Given:
    return Given.of(reported(), *rows, **more)


def after_touch(*rows) -> Given:
    return Given.of(touched(5), *rows)


def after_creating(kind: str, *rows) -> Given:
    return Given.of(ResourceCreated.of(kind), *rows)


CLAUDE = AgentRow(n=1, title="claude-1", data={"provider": "claude"})
RAN_ON = "This is a sentence. " * 25

SENT = wrote("Closed it earlier", seen=(AGENT,))
NAMED_ROWS = (SENT, Todo(n=3, title="Row"), Todo(n=4, title="Row"), IDLE)

OWED = AnswerOwed(agent=1, messages="message 5", numbers=(5,), rows=("message:5",))


LEDGER = ".journal/runtime/sessions/claude-1/displayed.json"
TURN = AgentRow(n=1, title="claude-1", data={"provider": "claude", "status": "idle", "last_message": "Done, it is filed."})
FILING = answering({("filing",): True})


def ledger(**held) -> dict:
    """The ledger of what the display hook brought, as the play stages it before the registration runs."""
    return {LEDGER: json.dumps(held)}


def in_a_codex_transcript(text: str) -> str:
    return json.dumps({"type": "response_item", "timestamp": "2026-01-01T00:00:00Z", "payload": {"type": "message", "role": "assistant", "content": [{"type": "output_text", "text": text}]}}) + "\n"


CODEX = AgentRow(n=1, title="codex-1", data={"provider": "codex", "status": "idle"})


def delivered(text: str) -> dict:
    return ledger(_matched=[fingerprint(text)])


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
            after_report(*(replace(wrote(f"and this {i}"), n=10 + i) for i in range(6)), WORKING) >> Dispatches(InboxUnread(agent=1).due("unread")),
            after_report(*(replace(wrote(f"and this {i}"), n=10 + i) for i in range(5)), WORKING) >> Dispatches(InboxSettled(agent=1)),
        ])
        journal.events.listen(AgentReported, SpotUnanswered(), expects=[
            after_report(asked(), IDLE) >> Dispatches(AnswerWaitBegan(agent=1, uses=1)) & Dispatches(OWED),
            after_report(asked(), reply(), IDLE) >> Dispatches(AnswersSettled(agent=1)),
            after_report(asked(), reaction(), IDLE) >> Dispatches(OWED),
            after_report(FILE_THE_REPORT, IDLE) >> Dispatches(AnswersSettled(agent=1)),
            after_report(ABOUT_A_TODO, IDLE) >> Dispatches(OWED),
            after_report(asked("Here is the result"), IDLE) >> Dispatches(OWED),
            after_report(asked(), AgentRow(n=1, title="claude-1", data={"status": "working", "uses": 13}), files=answering(Mark.staged("messages.answer hold", uses=3)))
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
            after_report(FILE_THE_REPORT, IDLE, settings={".messages.closing": False}) >> Dispatches(nothing),
        ])
        journal.events.listen(MessageUpdated, SpotMessagesSeenByUser(), expects=[
            after_touch(wrote("Done, it is filed.", seen=(AGENT, USER)), IDLE) >> Dispatches(MessagesReadByUser(numbers=(5,))),
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
            Given.of(ResourceCreated.of("comment"), asked(), reply(), IDLE, settings={".messages.closing": False}) >> Dispatches(nothing),
            after_creating("comment", asked(), replace(asked(), n=6), Comment(n=1, title="Both", refs=["message:5", "message:6"], seen=[AGENT]), IDLE)
                >> Dispatches(MessageSettled(n=5, how="answered by the agent")) & Dispatches(MessageSettled(n=6, how="answered by the agent")),
        ])
        journal.events.listen(AgentReported, SpotRunTogether(), expects=[
            Given(reported(), rows=[CLAUDE], transcript=in_a_transcript(RAN_ON)) >> Dispatches(RunTogether(agent=1).due("paragraphs")),
            Given(reported(), rows=[CLAUDE], transcript=in_a_transcript("This is a sentence.")) >> Dispatches(nothing),
            Given(reported(), rows=[CLAUDE], transcript=in_a_transcript(RAN_ON.replace(". ", ".\n\n", 1))) >> Dispatches(nothing),
            Given(reported(), rows=[CLAUDE], transcript=in_a_transcript(RAN_ON), settings={".messages.paragraphs": False}) >> Dispatches(nothing),
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
            Given.of(said('Answered 3, parked 4, then work 4; the suite (3) and "finished 4" pass'), *NAMED_ROWS) >> Dispatches(BareNumbersNamed(agent=1, n=5, numbers="3, 4")),
            Given.of(said("My reply to 3 went through; parking 4, 2 revisions left, released 2.84.63"), *NAMED_ROWS) >> Dispatches(BareNumbersNamed(agent=1, n=5, numbers="3, 4")),
            Given.of(said("Two steps:\n3. first\n4) second"), *NAMED_ROWS) >> Dispatches(nothing),
            Given.of(said("Opened PR 161, then pull request 162 and issue 40 on GitHub"), *NAMED_ROWS, Todo(n=161, title="Row"), Todo(n=162, title="Row"), Todo(n=40, title="Row"))
                >> Dispatches(nothing),
            Given.of(said("Answered 3, parked 4"), replace(SENT, updated=WHEN), Todo(n=3, title="Row", updated=1.0), Todo(n=4, title="Row", updated=1.0), IDLE) >> Dispatches(nothing),
            Given.of(said("The suite took 109 s, then 194 s and 23.8 s; the push got HTTP 408, a load average of 123 and the copy is 118 MB of 2 GB"), *NAMED_ROWS,
                     Todo(n=109, title="Row"), Todo(n=194, title="Row"), Todo(n=408, title="Row"), Todo(n=123, title="Row"), Todo(n=118, title="Row")) >> Dispatches(nothing),
            Given.of(said("the server crashed: it answered 500, the route returned 404 and the call came back with status 502 or an error 503"), *NAMED_ROWS,
                     Todo(n=500, title="Row"), Todo(n=404, title="Row"), Todo(n=502, title="Row"), Todo(n=503, title="Row")) >> Dispatches(nothing),
            Given.of(said("answered 20230 and closed 777"), *NAMED_ROWS, Todo(n=20230, title="Row"), Todo(n=777, title="Row")) >> Dispatches(BareNumbersNamed(agent=1, n=5, numbers="20230, 777")),
            Given.of(said("down from 980 loose files to 3; it waited 4 before"), *NAMED_ROWS, Todo(n=980, title="Row")) >> Dispatches(nothing),
            Given.of(said("all 358 viewer unit tests pass, and 358 viewer unit tests ran"), *NAMED_ROWS, Todo(n=358, title="Row")) >> Dispatches(nothing),
            Given.of(said("a number under 250 is a count, and so is more than 300"), *NAMED_ROWS, Todo(n=250, title="Row"), Todo(n=300, title="Row")) >> Dispatches(nothing),
            Given.of(said("I closed 482 for you."), SENT, Todo(n=482, title="Row"), IDLE, settings={".messages.numbers": False}) >> Dispatches(nothing),
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
            Given.of(InboxSettled(agent=1), IDLE, files=answering(Mark.staged("messages.unread", count=3))) >> Remembered("trigger-messages.unread", asdict(Mark())),
        ])
        journal.events.handle(InboxUnread, NameInbox(), expects=[
            Given.of(InboxUnread(agent=1), LATER) >> Nudged("inbox") & Remembered("trigger-messages.unread", asdict(Mark(count=1))),
            Given.of(InboxUnread(agent=1), LATER, settings={"messages.unread.patience": 0})
                >> Nudged("inbox") & Held("your inbox is unread: journal message unread, then journal message read <n> for each, before any other write"),
            Given.of(InboxUnread(agent=1), LATER, files=answering(Mark.staged("messages.unread", count=5)))
                >> Nudged("inbox") & Held("your inbox is unread: journal message unread, then journal message read <n> for each, before any other write")
                & Remembered("trigger-messages.unread", asdict(Mark(count=6))),
        ])
        journal.events.handle(AnswersSettled, ReleaseAnswering(), expects=[
            Given.of(AnswersSettled(agent=1), IDLE) >> Dispatches(nothing),
            Given.of(AnswersSettled(agent=1), IDLE, files=answering({**Mark.staged("messages.answering", count=2), **Mark.staged("messages.answer hold", uses=5)}))
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
            Given.of(AnswerOwed(agent=1, messages="message 5", numbers=(5,), rows=("message:5",)), IDLE, files=answering(Mark.staged("messages.answering", count=3)))
                >> Remembered("trigger-messages.answering", asdict(Mark(count=4))),
        ])
        journal.events.handle(MessagesReadByUser, CloseReadMessages(), expects=[
            Given.of(MessagesReadByUser(numbers=(5,)), wrote("Done, it is filed.", seen=(AGENT, USER)), IDLE) >> Updated(Message(n=5), outcome="read by the user"),
        ])
        journal.events.handle(MessageSettled, CloseTheMessage(), expects=[
            Given.of(MessageSettled(n=5, how="handled: todo:7"), asked(refs=["todo:7"]), IDLE) >> Updated(Message(n=5), outcome="handled: todo:7"),
            Given.of(MessageSettled(n=5, how="read by the user"), SENT, IDLE) >> Updated(Message(n=5), outcome="read by the user"),
            Given.of(MessageSettled(n=5, how="second"), replace(asked(), completed=WHEN, outcome="first"), IDLE) >> Unchanged(),
        ])
        journal.events.handle(RunTogether, NameRunTogether(), expects=[
            Given.of(RunTogether(agent=1), IDLE) >> Nudged("paragraphs"),
        ])
        journal.events.handle(BareNumbersNamed, NameBareNumbers(), expects=[
            Given.of(BareNumbersNamed(agent=1, n=5, numbers="482"), IDLE) >> Nudged("numbers", n=5, numbers="482"),
        ])
        journal.events.handle(ChunkDisplayed, KeepChunk(), expects=[
            Given(ChunkDisplayed(agent=1, message="m1", index=0, delta="Done, "), rows=[IDLE]) >> Dispatches(nothing),
            Given(ChunkDisplayed(agent=1, message="m1", index=0, delta="Done, it is filed.", final=True), rows=[IDLE])
                >> Dispatches(MessageDisplayed(agent=1, message="m1", text="Done, it is filed.")),
            Given(ChunkDisplayed(agent=1, message="m1", index=1, delta="it is filed.", final=True), earlier=(ChunkDisplayed(agent=1, message="m1", index=0, delta="Done, "),), rows=[IDLE])
                >> Dispatches(MessageDisplayed(agent=1, message="m1", text="Done, it is filed.")),
            Given(ChunkDisplayed(agent=1, message="m1", index=1, delta="it is filed.", final=True), rows=[IDLE]) >> Dispatches(nothing),
            Given(ChunkDisplayed(agent=1, message="b", index=0, delta="second", final=True), rows=[IDLE], files=answering(ledger(a={"0": "first "})))
                >> Dispatches(MessageDisplayed(agent=1, message="b", text="second")),
            Given(ChunkDisplayed(agent=1, message="m1", index=0, delta="Done, it is filed.", final=True), rows=[IDLE], files=answering(ledger(_done=["m1"]))) >> Dispatches(nothing),
        ])
        journal.events.handle(MessageDisplayed, PostDisplayed(), expects=[
            Given(MessageDisplayed(agent=1, message="m1", text="Done, it is filed."), rows=[IDLE]) >> Wrote(File(LEDGER, "_done")),
            Given(MessageDisplayed(agent=1, message="m1", text="   "), rows=[IDLE]) >> Unchanged(),
        ])
        journal.events.listen(TurnStopped, SpotTurnEnd(), expects=[
            Given(TurnStopped(agent=1), rows=[TURN]) >> Dispatches(TurnEnded(agent=1, words="Done, it is filed.").spaced("turn end|1", SETTLE)),
            Given(TurnStopped(agent=1), rows=[TURN], files=answering(delivered("Done, it is filed."))) >> Dispatches(TurnEnded(agent=1, words="Done, it is filed.")),
            Given(TurnStopped(agent=1), rows=[IDLE]) >> Dispatches(TurnEnded(agent=1, words="")),
        ])
        journal.events.listen(AgentReported, SpotPrompt(), expects=[
            Given(AgentReported(agent=1, hook="UserPromptSubmit"), rows=[IDLE]) >> Dispatches(PromptBegan(agent=1)),
            Given(AgentReported(agent=1, hook="PreToolUse"), rows=[IDLE]) >> Dispatches(nothing),
        ])
        journal.events.listen(TurnInterrupted, SpotCutOff(), expects=[
            Given(TurnInterrupted(agent=1, text="half a sentence"), rows=[IDLE]) >> Dispatches(TurnCutOff(agent=1, words="half a sentence")),
        ])
        journal.events.handle(TurnEnded, SendCutOffWords(), expects=[
            Given(TurnEnded(agent=1, words="Done, it is filed."), rows=[TURN], files=answering(ledger(m1={"0": "Done, it"}))) >> Wrote(File(LEDGER, "_done")),
            Given(TurnEnded(agent=1, words="Another thing."), rows=[TURN], files=answering(ledger(m1={"0": "Done, it"}))) >> Unchanged(),
            Given(TurnEnded(agent=1, words=""), rows=[TURN]) >> Unchanged(),
            Given(TurnEnded(agent=1, words="Done, it is filed."), rows=[TURN], faults=FILING, files=answering(ledger(_faults={"gone": WHEN - 1}))) >> Ran(("fault", FELL_BACK)),
        ])
        journal.events.handle(TurnEnded, CatchUpAfterTurn(), expects=[
            Given(TurnEnded(agent=1, words="Done, it is filed."), rows=[TURN], transcript=in_a_transcript("Never delivered."))
                >> Dispatches(FallbackHeld(agent=1, prints=(fingerprint("Never delivered."),))) & Wrote(File(LEDGER, "_sent")),
            Given(TurnEnded(agent=1, words="Done, it is filed."), rows=[TURN], transcript=in_a_transcript("Never delivered."), files=answering(delivered("Never delivered.")))
                >> Dispatches(nothing),
            Given(TurnEnded(agent=1, words="Done, it is filed."), rows=[TURN]) >> Dispatches(nothing),
            Given(TurnEnded(agent=1, words="Done, it is filed."), rows=[TURN], transcript=in_a_transcript("streamed") + in_a_transcript("never shown"), files=answering(delivered("streamed")))
                >> Dispatches(FallbackHeld(agent=1, prints=(fingerprint("never shown"),))),
            Given(TurnEnded(agent=1, words="what the Codex agent said"), rows=[CODEX], transcript=in_a_codex_transcript("what the Codex agent said")) >> Wrote(File(LEDGER.replace("claude-1", "codex-1"), "_sent")),
        ], after=("SendCutOffWords",))
        journal.events.handle(ToolFinished, CatchUpAfterTool(), expects=[
            Given(ToolFinished(agent=1, tool="exec_command"), rows=[CODEX], transcript=in_a_codex_transcript("[!reply:3] On it.")) >> Wrote(File(LEDGER.replace("claude-1", "codex-1"), "_sent")),
            Given(ToolFinished(agent=1, tool="Bash"), rows=[TURN], transcript=in_a_transcript("Never delivered.")) >> Unchanged(),
        ])
        journal.events.handle(PromptBegan, BeginTurn(), expects=[
            Given(PromptBegan(agent=1), rows=[TURN], transcript=in_a_transcript("Never delivered.")) >> Dispatches(FallbackHeld(agent=1, prints=(fingerprint("Never delivered."),)))
                & Wrote(File(LEDGER, fingerprint("Never delivered."))),
            Given(PromptBegan(agent=1), rows=[TURN], files=answering(ledger(_sent=["a" * 40, "plain"]))) >> Wrote(File(LEDGER, "plain")),
        ])
        journal.events.handle(TurnCutOff, PostCutOffTurn(), expects=[
            Given(TurnCutOff(agent=1, words="half a sentence"), rows=[TURN]) >> Wrote(File(LEDGER, "_sent")),
            Given(TurnCutOff(agent=1, words="half a sentence"), rows=[TURN], files=answering(delivered("half a sentence"))) >> Unchanged(),
        ])
        journal.events.handle(FallbackHeld, HoldFallbackFault(), expects=[
            Given(FallbackHeld(agent=1, prints=("abc",)), rows=[TURN]) >> Dispatches(FaultWindowOver(agent=1).spaced("fault window|1", HELD_FOR)) & Wrote(File(LEDGER, "_faults")),
        ])
        journal.events.handle(FaultWindowOver, RaiseHeldFaults(), expects=[
            Given(FaultWindowOver(agent=1), rows=[TURN], faults=FILING, files=answering(ledger(_faults={"abc": WHEN - 1}))) >> Ran(("fault", FELL_BACK)),
            Given(FaultWindowOver(agent=1), rows=[TURN], faults=FILING, files=answering(ledger(_faults={"abc": WHEN + 100}))) >> Unchanged(),
        ])
        journal.events.answer(TextFormatting, CommandsAsCode(), expects=[
            Given(TextFormatting(text="Run journal todo create to file it")) >> Answered(Rewritten("Run `journal todo create` to file it")),
            Given(TextFormatting(text="Pass --force to push")) >> Answered(Rewritten("Pass `--force` to push")),
            Given(TextFormatting(text="Run `journal todo create` to file it")) >> Answered(Rewritten("Run `journal todo create` to file it")),
            Given(TextFormatting(text="Edit src/--force.py now")) >> Answered(Rewritten("Edit src/--force.py now")),
            Given(TextFormatting(text="Nothing to quote here")) >> Answered(Rewritten("Nothing to quote here")),
            Given(TextFormatting(text="a journal question with options; journal question ask")) >> Answered(Rewritten("a journal question with options; `journal question ask`")),
            Given(TextFormatting(text="run python3 journal.py --root .journal upgrade, or pass --why"))
                >> Answered(Rewritten("run python3 journal.py --root .journal upgrade, or pass `--why`")),
        ])
        FACTS.register(self, *state_facts("message", "unread", lambda context: context.journal.get(Messages).unread(AGENT)),
                       *state_facts("message", "unanswered", lambda context: unanswered_in(context.journal)))

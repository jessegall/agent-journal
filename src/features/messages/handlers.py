from pathlib import Path

from events import Fact
from events.agents import ChunkDisplayed, ToolFinished
from events.messages import (FallbackHeld, FaultWindowOver, MessageDisplayed, PromptBegan, TurnCutOff, TurnEnded, AnswerHeld, AnswerOwed, AnswerRearmed, AnswersSettled, AnswerWaitBegan, BareNumbersNamed, FaceSent, InboxRearmed, InboxSettled, InboxUnread, MessageSettled, MessagesReadByUser,
                             RunTogether, TurnToPost)
from features.messages.listeners import ANSWER_HOLD, UNREAD_EVERY
from features.messages.mirroring import cut_off, collect, fault_brief, finish, hold_fault, next_turn, over, undelivered, withdraw
from framework.displayed import CATCH_UP, FELL_BACK, HELD_FOR, DisplayedLedger, fingerprint
from receiving import Handler
from resources.types import Message
from resources.types import AgentRow
from serving import Chat, Clock, Elsewhere, Faults, Marks, Providers, ReadRows, Rows, Settings

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


class CloseReadMessages(Handler[MessagesReadByUser]):
    def handle(self, event: MessagesReadByUser, messages: Rows[Message]) -> list[Fact]:
        messages.complete_all(event.numbers, "read by the user")
        return []


class NameRunTogether(Handler[RunTogether]):
    def handle(self, event: RunTogether, chat: Chat) -> list[Fact]:
        chat.nudge("paragraphs")
        return []


class NameBareNumbers(Handler[BareNumbersNamed]):
    def handle(self, event: BareNumbersNamed, chat: Chat) -> list[Fact]:
        chat.nudge("numbers", n=event.n, numbers=event.numbers)
        return []


def ledger_of(elsewhere: Elsewhere, row) -> DisplayedLedger:
    return DisplayedLedger(elsewhere.here().record.root, row.title)


def raise_due(ledger: DisplayedLedger, row, faults: Faults, now: float) -> None:
    """Files the fault of every fallback whose window has run out with nothing arriving."""
    count = over(ledger, now)
    if count:
        line, brief = fault_brief(count, row.title)
        faults.log(line)
        faults.file(FELL_BACK, brief)


def catch_up(row, ledger: DisplayedLedger, providers: Providers, chat: Chat, faults: Faults, now: float) -> list[Fact]:
    """The turns of the transcript the display hook did not bring go to the chat, and the fault of a hook that did not arrive is held."""
    provider = providers.offers(row.provider)
    if provider is None or not row.transcript:
        return []
    pending, found = undelivered(ledger, [turn for turn in provider.turns(Path(row.transcript)) if turn.has_agent_text and turn.at >= now - CATCH_UP])
    if not pending:
        return []
    faults.log(f"display fallback session {row.title} pending {[(turn.key, fingerprint(turn.text), len(turn.text)) for turn in pending]} {found}")
    held = provider.shows_what_is_said() and not provider.interrupted_by_user(Path(row.transcript))
    for turn in pending:
        chat.send(turn.text, turn.key)
    return [FallbackHeld(agent=row.n, prints=tuple(fingerprint(turn.text) for turn in pending))] if held else []


class KeepChunk(Handler[ChunkDisplayed]):
    def handle(self, event: ChunkDisplayed, agents: ReadRows[AgentRow], elsewhere: Elsewhere) -> list[Fact]:
        row = agents.peek(event.agent)
        text = collect(ledger_of(elsewhere, row), event.message, event.index, event.delta, event.final)
        return [MessageDisplayed(agent=row.n, message=event.message, text=text)] if text else []


class PostDisplayed(Handler[MessageDisplayed]):
    def handle(self, event: MessageDisplayed, agents: ReadRows[AgentRow], elsewhere: Elsewhere, chat: Chat) -> list[Fact]:
        if chat.send(event.text, event.message or None):
            finish(ledger_of(elsewhere, agents.peek(event.agent)), event.message, event.text)
        return []


class SendCutOffWords(Handler[TurnEnded]):
    def handle(self, event: TurnEnded, agents: ReadRows[AgentRow], elsewhere: Elsewhere, chat: Chat, faults: Faults, clock: Clock) -> list[Fact]:
        row = agents.peek(event.agent)
        ledger = ledger_of(elsewhere, row)
        raise_due(ledger, row, faults, clock.now())
        cut = cut_off(ledger, event.words) if event.words else []
        if cut:
            chat.send(event.words, cut[0] or None)
            withdraw(ledger, event.words)
        return []


class CatchUpAfterTurn(Handler[TurnEnded]):
    def handle(self, event: TurnEnded, agents: ReadRows[AgentRow], elsewhere: Elsewhere, providers: Providers, chat: Chat, faults: Faults, clock: Clock) -> list[Fact]:
        row = agents.peek(event.agent)
        return catch_up(row, ledger_of(elsewhere, row), providers, chat, faults, clock.now())


class CatchUpAfterTool(Handler[ToolFinished]):
    """A provider with no display hook has its words read after every tool call, so a reply written before one reaches the chat while it is fresh."""

    def handle(self, event: ToolFinished, agents: ReadRows[AgentRow], elsewhere: Elsewhere, providers: Providers, chat: Chat, faults: Faults, clock: Clock) -> list[Fact]:
        row = agents.peek(event.agent)
        provider = providers.offers(row.provider)
        if provider is None or provider.shows_what_is_said():
            return []
        return catch_up(row, ledger_of(elsewhere, row), providers, chat, faults, clock.now())


class BeginTurn(Handler[PromptBegan]):
    def handle(self, event: PromptBegan, agents: ReadRows[AgentRow], elsewhere: Elsewhere, providers: Providers, chat: Chat, faults: Faults, clock: Clock) -> list[Fact]:
        row = agents.peek(event.agent)
        ledger = ledger_of(elsewhere, row)
        raise_due(ledger, row, faults, clock.now())
        facts = catch_up(row, ledger, providers, chat, faults, clock.now())
        next_turn(ledger)
        return facts


class PostCutOffTurn(Handler[TurnCutOff]):
    def handle(self, event: TurnCutOff, agents: ReadRows[AgentRow], elsewhere: Elsewhere, providers: Providers, chat: Chat, faults: Faults, clock: Clock) -> list[Fact]:
        row = agents.peek(event.agent)
        chat.send(event.words, None)
        return catch_up(row, ledger_of(elsewhere, row), providers, chat, faults, clock.now())


class HoldFallbackFault(Handler[FallbackHeld]):
    def handle(self, event: FallbackHeld, agents: ReadRows[AgentRow], elsewhere: Elsewhere, clock: Clock) -> list[Fact]:
        row = agents.peek(event.agent)
        hold_fault(ledger_of(elsewhere, row), list(event.prints), clock.now() + HELD_FOR)
        return [FaultWindowOver(agent=row.n).spaced(f"fault window|{row.n}", HELD_FOR)]


class RaiseHeldFaults(Handler[FaultWindowOver]):
    def handle(self, event: FaultWindowOver, agents: ReadRows[AgentRow], elsewhere: Elsewhere, faults: Faults, clock: Clock) -> list[Fact]:
        row = agents.peek(event.agent)
        raise_due(ledger_of(elsewhere, row), row, faults, clock.now())
        return []

from events import Fact
from events.dumps import (DumpArrived, DumpChoiceMade, DumpChoiceOpen, DumpFilingStalled, DumpFiledAway, DumpQuestionAnswered,
                          TranscriptPasted)
from receiving import Handler
from resources.types import Dump, Message
from serving import Chat, Rows


class TellDumpArrived(Handler[DumpArrived]):
    def handle(self, event: DumpArrived, chat: Chat) -> list[Fact]:
        chat.say("arrived", n=event.n, count=event.items)
        return []


class TellChoiceMade(Handler[DumpChoiceMade]):
    def handle(self, event: DumpChoiceMade, chat: Chat) -> list[Fact]:
        chat.say("chose", n=event.n, label=event.label)
        return []


class TellChoiceOpen(Handler[DumpChoiceOpen]):
    def handle(self, event: DumpChoiceOpen, chat: Chat) -> list[Fact]:
        chat.say("decide", n=event.n)
        return []


class TellQuestionAnswered(Handler[DumpQuestionAnswered]):
    def handle(self, event: DumpQuestionAnswered, chat: Chat) -> list[Fact]:
        chat.say("answered", n=event.n, answer=event.answer, question=event.question)
        return []


class TellDumpFiled(Handler[DumpFiledAway]):
    def handle(self, event: DumpFiledAway, chat: Chat) -> list[Fact]:
        chat.say("filed", n=event.n, outcome=event.outcome)
        return []


class CarryOnFiling(Handler[DumpFilingStalled]):
    def handle(self, event: DumpFilingStalled, chat: Chat) -> list[Fact]:
        chat.say("carry on", n=event.n, count=event.items)
        return []


class TranscriptToDump(Handler[TranscriptPasted]):
    def handle(self, event: TranscriptPasted, messages: Rows[Message], dumps: Rows[Dump]) -> list[Fact]:
        message = messages.load(event.message)
        dump = dumps.acting(event.actor).create(brief=message.brief)
        for path in messages.paths(message.n):
            dumps.attach(dump.n, path)
        dumps.link(dump.n, message.ref)
        messages.link(message.n, dump.ref)
        return []

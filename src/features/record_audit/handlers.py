from events import Fact
from events.record_audit import EvidenceFound
from receiving import Handler
from serving import Chat


class SayEvidence(Handler[EvidenceFound]):
    def handle(self, event: EvidenceFound, chat: Chat) -> list[Fact]:
        chat.say("evidence", count=event.count, found=event.found)
        return []

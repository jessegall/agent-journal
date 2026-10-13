from events.answers import Allowed, Answer, Rewritten
from events.asking import HookResponding
from features.session_briefing.block import briefing
from payload import HookEvent
from receiving import Answerer
from serving import ReadElsewhere, ReadJournalRoot


class BriefTheSession(Answerer[HookResponding]):
    def answer(self, request: HookResponding, elsewhere: ReadElsewhere, journal_root: ReadJournalRoot) -> Answer:
        text = briefing(elsewhere.here().record, journal_root, request.compacted) if request.event == HookEvent.SESSION_START else ""
        return Rewritten(text) if text else Allowed()

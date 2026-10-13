from events.answers import Allowed, Answer, Rewritten
from events.asking import HookResponding
from features.session_briefing.block import briefing
from payload import HookEvent
from receiving import Answerer
from serving import ReadElsewhere


class BriefTheSession(Answerer[HookResponding]):
    def answer(self, request: HookResponding, elsewhere: ReadElsewhere) -> Answer:
        text = briefing(elsewhere.here().record, request.compacted) if request.event == HookEvent.SESSION_START else ""
        return Rewritten(text) if text else Allowed()

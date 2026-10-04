from features.base import Feature
from features.journal import Journal
from features.session_briefing.block import briefing
from features.session_briefing.details import SessionBriefingDetails
from providers.payload import HookEvent
from features.session_briefing.handlers import GreetOnce, RebuildStartBlock


class SessionBriefing(Feature):
    details = SessionBriefingDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(GreetOnce())
        journal.events.handler(RebuildStartBlock())
        journal.agent.responder(HookEvent.SESSION_START, briefing)

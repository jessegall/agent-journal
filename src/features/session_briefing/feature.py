from engine.events.agents import SessionStarted
from expects import Given, Nudged
from features.base import Feature
from features.journal import Journal
from resources.types import AgentRow
from features.session_briefing.block import briefing
from features.session_briefing.details import SessionBriefingDetails
from providers.payload import HookEvent
from features.session_briefing.handlers import GreetOnce, RebuildStartBlock


class SessionBriefing(Feature):
    details = SessionBriefingDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(GreetOnce(), expects=[
            Given(SessionStarted(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Nudged("ready"),
        ])
        journal.events.handler(RebuildStartBlock())
        journal.agent.responder(HookEvent.SESSION_START, briefing)

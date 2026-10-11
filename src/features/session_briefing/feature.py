from engine.events.agents import SessionStarted
from expects import Given, Nudged, Unchanged
from engine.events.resources import AnyEvent
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
        journal.events.handler(RebuildStartBlock(), expects=[
            Given(AnyEvent(n=1, type="nudge", action="created"), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
        ])
        journal.agent.responder(HookEvent.SESSION_START, briefing)

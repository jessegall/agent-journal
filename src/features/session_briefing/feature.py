from events.agents import SessionStarted
from expects import Answered, Given, Hooked, Nudged, Unchanged
from events.resources import AnyEvent
from framework.base import Feature
from framework.journal import Journal
from resources.types import AgentRow
from features.session_briefing.block import COMPACTED, briefing
from features.session_briefing.details import SessionBriefingDetails
from providers.payload import HookEvent
from features.session_briefing.handlers import GreetOnce, RebuildStartBlock


CLAUDE = AgentRow(n=1, title="claude-1", data={"provider": "claude"})


class Written:
    def __eq__(self, text: str) -> bool:
        return bool(text) and not text.startswith(COMPACTED)


class Opening:
    def __init__(self, text: str) -> None:
        self.text = text

    def __eq__(self, text: str) -> bool:
        return text.startswith(self.text)


class SessionBriefing(Feature):
    details = SessionBriefingDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(GreetOnce(), expects=[
            Given(SessionStarted(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Nudged("ready"),
        ])
        journal.events.handler(RebuildStartBlock(), expects=[
            Given(AnyEvent(n=1, type="nudge", action="created"), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
        ])
        journal.agent.responder(HookEvent.SESSION_START, briefing, expects=[
            Given("a session starts", rows=[CLAUDE], hook=Hooked(event="SessionStart", source="startup")) >> Answered(Written()),
            Given("a session starts", rows=[CLAUDE], hook=Hooked(event="SessionStart", source="compact")) >> Answered(Opening(COMPACTED)),
        ])

from typing import TypeVar

from journal.events.agent.agent_event import AgentEvent
from journal.events.agent_listener import AgentListener
from journal.features.triggers.support.firing import Firing
from journal.support.decision import Decision
from journal.repositories.triggers import Triggers

A = TypeVar("A", bound=AgentEvent)


class Watching(AgentListener[A]):
    """What watching a prompt and watching a tool call share: the triggers the text meets are recorded as cards, and a sequence one starts, on the user's own words, answers with its first step."""

    blocking = True

    def __init__(self, triggers: Triggers, firing: Firing) -> None:
        self.triggers, self.firing = triggers, firing

    def text_of(self, event: A) -> str:
        raise NotImplementedError

    def by_user(self, event: A) -> bool:
        return False

    def handle(self, event: A) -> Decision | None:
        met = self.triggers.met_by(self.text_of(event))
        if not met:
            return None
        lines = self.firing.lines(met, event.session, event.environment_id, self.by_user(event))
        return Decision.allowed_with("\n".join(lines)) if lines else None

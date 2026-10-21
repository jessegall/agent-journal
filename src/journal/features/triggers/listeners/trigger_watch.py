from typing import TypeVar

from journal.events.agent.agent_event import AgentEvent
from journal.events.agent_listener import AgentListener
from journal.features.triggers.support.trigger_fire import TriggerFire
from journal.support.decision import Decision
from journal.repositories.triggers import Triggers

E = TypeVar("E", bound=AgentEvent)


class TriggerWatch(AgentListener[E]):
    """What watching a prompt and watching a tool call share: the triggers the text meets are recorded as cards, and a sequence one starts, on the user's own words, is started, its first step told at the agent's next stop."""

    blocking = True

    def __init__(self, triggers: Triggers, firing: TriggerFire) -> None:
        self.triggers, self.firing = triggers, firing

    def text(self, event: E) -> str:
        raise NotImplementedError

    def is_users(self, event: E) -> bool:
        return False

    def handle(self, event: E) -> None:
        matched = self.triggers.matches(self.text(event))
        if matched:
            self.firing.fired(matched, event.session, event.environment_id, self.is_users(event))

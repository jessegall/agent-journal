from typing import TypeVar

from journal.events.agent.agent_event import AgentEvent
from journal.events.agent_listener import AgentListener
from journal.features.triggers.support.trigger_fire import TriggerFire
from journal.support.decision import Decision
from journal.repositories.triggers import Triggers

A = TypeVar("A", bound=AgentEvent)


class TriggerWatch(AgentListener[A]):
    """What watching a prompt and watching a tool call share: the triggers the text meets are recorded as cards, and a sequence one starts, on the user's own words, is started, its first step told at the agent's next stop."""

    blocking = True

    def __init__(self, triggers: Triggers, firing: TriggerFire) -> None:
        self.triggers, self.firing = triggers, firing

    def text_of(self, event: A) -> str:
        raise NotImplementedError

    def by_user(self, event: A) -> bool:
        return False

    def handle(self, event: A) -> None:
        matched = self.triggers.met_by(self.text_of(event))
        if matched:
            self.firing.fired(matched, event.session, event.environment_id, self.by_user(event))

from typing import TypeVar

from journal.events.agent.agent_event import AgentEvent
from journal.features.agent_listener import AgentListener
from journal.features.triggers.firing import Firing
from journal.hooks.decision import Decision
from journal.models.trigger_action import TriggerAction
from journal.repositories.triggers import Triggers

A = TypeVar("A", bound=AgentEvent)


class Watching(AgentListener[A]):
    """What watching a prompt and watching a tool call share: the triggers the text meets, said or refused by their action."""

    blocking = True

    def __init__(self, triggers: Triggers, firing: Firing) -> None:
        self.triggers, self.firing = triggers, firing

    def text_of(self, event: A) -> str:
        raise NotImplementedError

    def can_deny(self) -> bool:
        return False

    def handle(self, event: A) -> Decision | None:
        from journal.features.triggers.feature import Triggers as TriggersFeature
        met = self.triggers.met_by(self.text_of(event))
        if not met:
            return None
        denied = [t for t in met if t.action == TriggerAction.DENY]
        if denied and self.can_deny():
            return Decision.refuse(TriggersFeature.DENIED.about(title=denied[0].text).rendered())
        lines = self.firing.lines(met, event.session, event.environment_id)
        return Decision.tell("\n".join(lines)) if lines else None

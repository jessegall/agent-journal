from typing import TypeVar

from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.agent_event import AgentEvent
from journal.features.agent_listener import AgentListener
from journal.hooks.decision import Decision
from journal.models.trigger import Trigger
from journal.models.trigger_action import TriggerAction
from journal.repositories.triggers import Triggers

A = TypeVar("A", bound=AgentEvent)


class Watching(AgentListener[A]):
    """What watching a prompt and watching a tool call share: the triggers the text meets, said or refused by their action."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, triggers: Triggers) -> None:
        self.machine, self.nudger, self.triggers = machine, nudger, triggers

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
        agent = self.machine.agent(event.session, event.environment_id)
        lines = [line for trigger in met if (line := self.nudger.say(agent, self.said(trigger)))]
        return Decision.tell("\n".join(lines)) if lines else None

    @staticmethod
    def said(trigger: Trigger):
        from journal.features.triggers.feature import Triggers as TriggersFeature
        return (TriggersFeature.INSTRUCT if trigger.action == TriggerAction.INSTRUCT else TriggersFeature.NUDGE).about(title=trigger.text)

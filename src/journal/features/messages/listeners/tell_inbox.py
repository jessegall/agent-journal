from typing import TypeVar

from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.agent_event import AgentEvent
from journal.features.agent_listener import AgentListener
from journal.hooks.decision import Decision
from journal.repositories.messages import Messages

A = TypeVar("A", bound=AgentEvent)


class TellInbox(AgentListener[A]):
    """What the three moments share: unread messages from the user are put before the agent, numbered, so it answers them before anything else."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, messages: Messages) -> None:
        self.machine, self.nudger, self.messages = machine, nudger, messages

    def handle(self, event: A) -> Decision | None:
        from journal.features.messages.feature import Messages as MessagesFeature
        unread = self.messages.unread(event.environment_id)
        if not unread:
            return None
        rows = "; ".join(f"{m.id}. {m.text}" for m in unread)
        line = self.nudger.say(self.machine.agent(event.session, event.environment_id), MessagesFeature.ANSWER.about(messages=rows))
        return Decision.tell(line) if line else None

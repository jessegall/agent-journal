from typing import TypeVar

from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.agent_event import AgentEvent
from journal.features.agent_listener import AgentListener
from journal.hooks.decision import Decision
from journal.repositories.messages import Messages

A = TypeVar("A", bound=AgentEvent)


class TellInbox(AgentListener[A]):
    """What the three moments share: what waits unread is named to the agent by number, so it reads and answers it before anything else."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, messages: Messages) -> None:
        self.machine, self.nudger, self.messages = machine, nudger, messages

    def handle(self, event: A) -> Decision | None:
        from journal.features.messages.feature import Messages as MessagesFeature
        unread = self.messages.unread(event.environment_id)
        if not unread:
            return None
        line = self.nudger.say(self.machine.agent(event.session, event.environment_id), MessagesFeature.inbox(unread))
        return Decision.tell(line) if line else None

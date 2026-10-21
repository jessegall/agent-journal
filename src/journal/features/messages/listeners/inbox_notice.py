from typing import TypeVar

from journal.engine.state_machine import StateMachine
from journal.engine.nudger import Nudger
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent_listener import AgentListener
from journal.support.decision import Decision
from journal.repositories.messages import Messages

E = TypeVar("E", bound=AgentEvent)


class InboxNotice(AgentListener[E]):
    """What the three moments share: what waits unread is named to the agent by number, so it reads and answers it before anything else."""

    blocking = True

    def __init__(self, machine: StateMachine, nudger: Nudger, messages: Messages) -> None:
        self.machine, self.nudger, self.messages = machine, nudger, messages

    def handle(self, event: E) -> Decision | None:
        from journal.features.messages.feature import Messages as MessagesFeature
        unread = self.messages.unread()
        if not unread:
            return None
        line = self.nudger.deliver(self.machine.agent(event.session, event.environment_id), MessagesFeature.inbox(tuple(m.id for m in unread)))
        return Decision.allowed_with(line) if line else None

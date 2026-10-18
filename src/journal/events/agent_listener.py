from typing import ClassVar, TypeVar

from journal.events.agent.agent_event import AgentEvent
from journal.events.listener import Listener
from journal.events.decision import Decision

A = TypeVar("A", bound=AgentEvent)


class AgentListener(Listener[A]):
    """A feature's handler for one agent event. Deferred by default: the server replies first and runs it after. A handler that must answer before the agent goes on says so with blocking = True, and only then does its decision reach the agent."""

    blocking: ClassVar[bool] = False
    asked_while_free: ClassVar[bool] = False
    """A blocking listener asked only while nothing has held the event; once it is held, it hears the event after the reply."""

    def handle(self, event: A) -> Decision | None:
        return None

from typing import ClassVar, TypeVar

from journal.events.agent.agent_event import AgentEvent
from journal.events.listener import Listener
from journal.support.decision import Decision

E = TypeVar("E", bound=AgentEvent)


class AgentListener(Listener[E]):
    """E feature's handler for one agent event. Deferred by default: the server replies first and runs it after. E handler that must answer before the agent goes on says so with blocking = True, and only then does its decision reach the agent."""

    blocking: ClassVar[bool] = False
    free_request: ClassVar[bool] = False

    def handle(self, event: E) -> Decision | None:
        return None

from abc import abstractmethod
from collections.abc import Sequence
from typing import TypeVar

from engine.agent_machine.needs.step_requests import StepRequests
from engine.command.context import Context
from engine.listener.save_listener import SaveListener

E = TypeVar("E")


class AgentListener(SaveListener[E]):
    """Hears a row event inside the write that saved it and names the agents to step for it (doc 1310 section
    6.2); the requests commit with the change, so a server that dies right after the commit still finds
    them. It does nothing else: no step, bus or state."""

    def __init__(self, requests: StepRequests) -> None:
        self.requests = requests

    @abstractmethod
    def agents(self, event: E) -> Sequence[int]: ...

    def handle(self, event: E, context: Context) -> None:
        agent_ids = self.agents(event)
        if agent_ids:
            self.requests.requested(agent_ids, self.name, context)

from abc import ABC, abstractmethod
from collections.abc import Sequence
from typing import Generic, TypeVar

E = TypeVar("E")


class AgentListener(ABC, Generic[E]):
    """Hears a row event and names the agents to step for it, and does nothing else."""

    @abstractmethod
    def agents(self, event: E) -> Sequence[int]: ...

from abc import ABC, abstractmethod
from typing import ClassVar

from engine.agent_machine.agent_view import AgentView


class WakeCause(ABC):
    """A reason a resting agent must be given a turn: when it is due, the text that wakes it, and what
    inhibits it."""

    key: ClassVar[str]
    # a cause that wakes an agent whose turn never ended, such as one cut short by a server stop
    wakes_mid_turn: ClassVar[bool] = False

    @abstractmethod
    def requires_wake(self, view: AgentView) -> bool: ...

    @abstractmethod
    def text(self, view: AgentView) -> str: ...

    def is_inhibited(self, view: AgentView) -> bool:
        return False

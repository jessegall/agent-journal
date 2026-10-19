from typing import Protocol

from journal.engine.agent_state import AgentState
from journal.engine.nudge import Nudge


class FeaturesKnown(Protocol):
    """What the engine asks of the features without knowing any: the states they bring, and whether a line of theirs is switched off."""

    def states(self) -> list[type[AgentState]]: ...

    def silenced(self, nudge: Nudge) -> bool: ...

from typing import Protocol, runtime_checkable

from journal.engine.base_state import BaseState
from journal.engine.support.modes import Modes
from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.models.agent_role import AgentRole
from journal.support.option import Option


@runtime_checkable
class FeatureRegistry(Protocol):
    """What the engine asks of the features without knowing any: the states they bring, the work modes they offer, and whether a line of theirs is switched off."""

    def states(self) -> list[type[BaseState]]: ...

    def modes(self) -> list[Modes]: ...

    def options(self) -> list[Option]: ...

    def conducts(self, role: AgentRole) -> tuple[type[Conduct], ...]: ...

    def silenced(self, nudge: Nudge) -> bool: ...

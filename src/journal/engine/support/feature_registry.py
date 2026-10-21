from typing import Protocol

from journal.engine.base_state import BaseState
from journal.engine.support.modes import Modes
from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.support.option import Option


class FeatureRegistry(Protocol):
    """What the engine asks of the features without knowing any: the states they bring, the work modes they offer, and whether a line of theirs is switched off."""

    def states(self) -> list[type[BaseState]]: ...

    def modes(self) -> list[Modes]: ...

    def options(self) -> list[Option]: ...

    def conducts(self) -> tuple[type[Conduct], ...]: ...

    def silenced(self, nudge: Nudge) -> bool: ...

from typing import Protocol

from journal.engine.base_state import BaseState
from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.support.option import Option


class FeaturesKnown(Protocol):
    """What the engine asks of the features without knowing any: the states they bring, and whether a line of theirs is switched off."""

    def states(self) -> list[type[BaseState]]: ...

    def options(self) -> list[Option]: ...

    def conducts(self) -> tuple[type[Conduct], ...]: ...

    def silenced(self, nudge: Nudge) -> bool: ...

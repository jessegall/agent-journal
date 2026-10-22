from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.support.option import Option


@dataclass(frozen=True)
class Modes:
    """A feature's work modes: the setting that picks one, and the state each mode puts at the bottom of every stack."""

    option: Option
    states: dict[str, type[BaseState]]

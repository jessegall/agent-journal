from collections.abc import Sequence
from dataclasses import dataclass
from enum import StrEnum

from engine.model.added_state import AddedState
from engine.model.model import Model
from engine.model.move import Move


@dataclass(frozen=True)
class StateAddition:
    """A state a module adds to a state holder: its word, the existing state it looks like in the viewer, the state
    its rows go to if the module leaves, whether a row in it can be edited or deleted, the moves into and
    out of it, and the read line, with {row_id} for the row, that gives the tooltip of the state's badge."""

    holder: type[Model]
    state: AddedState
    label: str
    looks_like: StrEnum
    fallback_state: StrEnum
    moves: Sequence[Move]
    editable: bool = False
    deletable: bool = False
    third_party: bool = False
    tip_read: str = ""

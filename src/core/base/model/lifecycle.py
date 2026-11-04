from collections.abc import Sequence
from enum import StrEnum
from typing import ClassVar

from core.base.model.added_state import StateValue
from core.base.model.move import Move


def outgoing(moves: Sequence[Move], state: StateValue) -> tuple[Move, ...]:
    return tuple(move for move in moves if state in move.sources)


def next_moves_text(moves: Sequence[Move], cli_name: str, row_id: int, state: StateValue) -> str:
    lines = [f"journal {cli_name} {move.name} {row_id}" for move in outgoing(moves, state)]
    return f"from {state.value} it can only go on with {', '.join(lines)}" if lines else f"{state.value} is final"


class Lifecycle:
    """The states a row can be in and the moves allowed between them."""

    states: ClassVar[type[StrEnum]]
    initial: ClassVar[Sequence[StrEnum]]
    editable: ClassVar[Sequence[StrEnum]]
    deletable: ClassVar[Sequence[StrEnum]]

    @classmethod
    def moves(cls) -> tuple[Move, ...]:
        return tuple(value for value in vars(cls).values() if isinstance(value, Move))

    @classmethod
    def attribute_name_mismatches(cls) -> list[str]:
        return [attribute for attribute, value in vars(cls).items() if isinstance(value, Move) and value.name != attribute]

    @classmethod
    def outgoing_moves(cls, state: StateValue) -> tuple[Move, ...]:
        return outgoing(cls.moves(), state)

    @classmethod
    def suggestion(cls, cli_name: str, row_id: int, state: StateValue) -> str:
        return next_moves_text(cls.moves(), cli_name, row_id, state)

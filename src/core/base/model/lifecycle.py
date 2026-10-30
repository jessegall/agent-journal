from enum import StrEnum
from typing import ClassVar

from core.base.model.move import Move


class Lifecycle:
    """A model's states and the moves between them, the states a new row may start in, and the states in which it
    may be edited or deleted. Each move is an attribute named as the move."""

    states: ClassVar[type[StrEnum]]
    initial: ClassVar[tuple[StrEnum, ...]]
    editable: ClassVar[tuple[StrEnum, ...]]
    deletable: ClassVar[tuple[StrEnum, ...]]

    @classmethod
    def moves(cls) -> tuple[Move, ...]:
        return tuple(value for value in vars(cls).values() if isinstance(value, Move))

    @classmethod
    def misnamed_moves(cls) -> tuple[str, ...]:
        return tuple(attribute for attribute, value in vars(cls).items() if isinstance(value, Move) and value.name != attribute)

    @classmethod
    def outgoing_moves(cls, state: StrEnum) -> tuple[Move, ...]:
        return tuple(move for move in cls.moves() if state in move.sources)

    @classmethod
    def remedy(cls, cli_noun: str, row_id: int, state: StrEnum) -> str:
        lines = [f"journal {cli_noun} {move.name} {row_id}" for move in cls.outgoing_moves(state)]
        return f"from {state.value} it can only go on with {', '.join(lines)}" if lines else f"{state.value} is final"

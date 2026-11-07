from collections.abc import Sequence
from dataclasses import dataclass, replace

from core.base.model.added_state import AddedState, StateValue
from core.base.model.lifecycle import Lifecycle, outgoing, next_moves_text
from core.base.model.model import Model
from core.base.model.move import Move
from core.base.model.state_addition import StateAddition
from core.base.model.state_holder import StateHolder


@dataclass(frozen=True)
class FullLifecycle:
    """One model's lifecycle with its added states: the same questions Lifecycle answers, and the moves its model
    keeps open gain the added states as sources."""

    model: type[Model]
    lifecycle: type[Lifecycle]
    additions: tuple[StateAddition, ...]

    @property
    def added_states(self) -> tuple[AddedState, ...]:
        return tuple(addition.state for addition in self.additions)

    @property
    def initial(self) -> Sequence[StateValue]:
        return self.lifecycle.initial

    @property
    def editable(self) -> tuple[StateValue, ...]:
        return (*self.lifecycle.editable, *(addition.state for addition in self.additions if addition.editable))

    @property
    def deletable(self) -> tuple[StateValue, ...]:
        return (*self.lifecycle.deletable, *(addition.state for addition in self.additions if addition.deletable))

    def moves(self) -> tuple[Move, ...]:
        open_moves = self.model.added_state_moves if issubclass(self.model, StateHolder) else ()
        base_moves = tuple(replace(move, sources=(*move.sources, *self.added_states)) if move in open_moves else move for move in self.lifecycle.moves())
        return (*base_moves, *(move for addition in self.additions for move in addition.moves))

    def is_third_party_move(self, name: str) -> bool:
        return any(move.name == name for addition in self.additions if addition.third_party for move in addition.moves)

    def state_words(self) -> tuple[str, ...]:
        return (*(state.value for state in self.lifecycle.states), *self.added_states)

    def has_state(self, state: StateValue) -> bool:
        return state in tuple(self.lifecycle.states) or state in self.added_states

    def has_move(self, name: str) -> bool:
        return any(move.name == name for move in self.moves())

    def move(self, name: str) -> Move:
        return next(move for move in self.moves() if move.name == name)

    def outgoing_moves(self, state: StateValue) -> tuple[Move, ...]:
        return outgoing(self.moves(), state)

    def suggestion(self, cli_name: str, row_id: int, state: StateValue) -> str:
        return next_moves_text(self.moves(), cli_name, row_id, state)

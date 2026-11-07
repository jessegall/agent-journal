from collections.abc import Mapping
from dataclasses import dataclass
from enum import StrEnum
from typing import Any

from core.base.dotted_path.dotted_path import DottedPath
from core.base.model.added_state import AddedState, StateValue
from core.base.model.model import Model
from core.base.model.model_error import ModelError
from core.base.model.move import Move
from core.base.model.state_addition import StateAddition
from core.base.model.state_holder import StateHolder
from core.base.registry.state_move_entry import StateMoveEntry


@dataclass(frozen=True)
class StateAdditionEntry:
    """A state a module added, as the registry stores it, with the module that added it and the name of the
    model it was added to."""

    module: str
    holder: str
    model_name: str
    state: str
    label: str
    looks_like: str
    fallback_state: str
    moves: tuple[StateMoveEntry, ...]
    editable: bool
    deletable: bool
    open_moves: tuple[str, ...]
    third_party: bool
    tip_read: str = ""

    @classmethod
    def declared(cls, module: str, addition: StateAddition, third_party: bool) -> "StateAdditionEntry":
        open_moves = addition.holder.added_state_moves if issubclass(addition.holder, StateHolder) else ()
        return cls(module, DottedPath.class_path(addition.holder).text, addition.holder.model_name, str(addition.state), addition.label, addition.looks_like.value,
                   addition.fallback_state.value, tuple(StateMoveEntry(move.name, tuple(source.value for source in move.sources), move.target.value) for move in addition.moves),
                   addition.editable, addition.deletable, tuple(move.name for move in open_moves), third_party, addition.tip_read)

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "StateAdditionEntry":
        moves = tuple(StateMoveEntry(move["name"], tuple(move["sources"]), move["target"]) for move in stored["moves"])
        return cls(stored["module"], stored["holder"], stored["model_name"], stored["state"], stored["label"], stored["looks_like"], stored["fallback_state"],
                   moves, stored["editable"], stored["deletable"], tuple(stored["open_moves"]), stored["third_party"], stored.get("tip_read", ""))

    def addition(self) -> StateAddition:
        holder = DottedPath(self.holder).checked_class(Model)
        if holder.lifecycle is None:
            raise ModelError(f"{holder.__name__} has no lifecycle, so it cannot hold the state {self.state}")
        states = holder.lifecycle.states
        moves = tuple(Move(move.name, tuple(state_word(states, source) for source in move.sources), state_word(states, move.target)) for move in self.moves)
        return StateAddition(holder, AddedState(self.state), self.label, states(self.looks_like), states(self.fallback_state), moves, self.editable, self.deletable, self.third_party, self.tip_read)


def state_word(states: type[StrEnum], word: str) -> StateValue:
    return states(word) if word in states._value2member_map_ else AddedState(word)

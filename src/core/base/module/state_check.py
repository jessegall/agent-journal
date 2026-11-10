import re
from collections.abc import Sequence

from engine.model.model import Model
from engine.model.state_addition import StateAddition
from engine.model.state_holder import StateHolder
from core.base.module.module import Module

STATE_WORD = re.compile(r"^[a-z]+(-[a-z]+)*$")
STANDARD_MOVES = ("create", "update", "delete", "metadata")


class StateCheck:
    """Checks the states modules add before a sync writes anything: each is new and reachable, leads back, and is
    added by a module that depends on its model's module."""

    def problems(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        owners = {declaration.model: module for module in modules for declaration in module.models}
        problems: list[str] = []
        for model, module in owners.items():
            if issubclass(model, StateHolder):
                problems.extend(self.open_move_problems(model))
        claimed: dict[tuple[str, str], str] = {}
        for module in modules:
            for addition in module.added_states:
                problems.extend(self.addition_problems(module, addition, owners, claimed))
        return tuple(problems)

    @staticmethod
    def open_move_problems(model: type[Model]) -> list[str]:
        lifecycle_moves = model.lifecycle.moves() if model.lifecycle else ()
        return [f"{model.__name__} keeps open {move.name}, which is no move of its lifecycle" for move in getattr(model, "added_state_moves", ()) if move not in lifecycle_moves]

    def addition_problems(self, module: type[Module], addition: StateAddition, owners: dict[type[Model], type[Module]], claimed: dict[tuple[str, str], str]) -> list[str]:
        holder, state = addition.holder, addition.state
        lifecycle = holder.lifecycle
        if not issubclass(holder, StateHolder) or holder not in owners or lifecycle is None:
            return [f"{module.name} adds the state {state} to {holder.cli_name}, which is no state holder"]
        name = f"{module.name}'s state {state} of {holder.cli_name}"
        key = (holder.model_name, str(state))
        problems = [f"{name}: {claimed[key]} adds that state too"] if key in claimed else []
        claimed[key] = module.name
        if owners[holder].name not in module.dependencies and owners[holder] is not module:
            problems.append(f"{name}: the module does not depend on {owners[holder].name}")
        if state in tuple(member.value for member in lifecycle.states):
            problems.append(f"{name}: {holder.cli_name} already has that state")
        if not STATE_WORD.match(state):
            problems.append(f"{name}: a state is lowercase letters and dashes")
        if not addition.label.strip():
            problems.append(f"{name}: it has no label")
        if not isinstance(addition.looks_like, lifecycle.states) or not isinstance(addition.fallback_state, lifecycle.states):
            problems.append(f"{name}: looks_like and fallback_state are states of {lifecycle.states.__name__}")
        return problems + self.move_problems(name, addition, lifecycle.moves())

    @staticmethod
    def move_problems(name: str, addition: StateAddition, lifecycle_moves: Sequence[object]) -> list[str]:
        state = addition.state
        entering_moves = [move for move in addition.moves if move.target == state]
        leaving_moves = [move for move in addition.moves if state in move.sources]
        problems: list[str] = []
        if not entering_moves or not leaving_moves:
            problems.append(f"{name}: it needs a move in and a move out")
        for move in addition.moves:
            if move.target != state and list(move.sources) != [state]:
                problems.append(f"{name}: the move {move.name} does not touch the state")
            if move.name in STANDARD_MOVES or any(getattr(lifecycle_move, "name", "") == move.name for lifecycle_move in lifecycle_moves):
                problems.append(f"{name}: the move {move.name} is taken")
        entries = {source for move in entering_moves for source in move.sources}
        for move in leaving_moves:
            if move.target not in entries and move.target != addition.fallback_state:
                problems.append(f"{name}: the move {move.name} skips ahead to {move.target}")
        if leaving_moves and all(move.target != addition.fallback_state for move in leaving_moves):
            problems.append(f"{name}: no move leads to its fallback state {addition.fallback_state}")
        return problems

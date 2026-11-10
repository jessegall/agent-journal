from collections.abc import Sequence
from enum import StrEnum

from engine.model.added_state import AddedState
from engine.model.lifecycle import Lifecycle
from engine.model.model import Model
from engine.model.move import Move
from engine.model.state_addition import StateAddition
from engine.model.state_holder import StateHolder
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.module.state_check import StateCheck


class ItemState(StrEnum):
    OPEN = "open"
    FINISHED = "done"


class ItemLifecycle(Lifecycle):
    states = ItemState
    initial = [ItemState.OPEN]
    editable = [ItemState.OPEN]
    deletable = []
    finish = Move("finish", [ItemState.OPEN], ItemState.FINISHED)


class Item(Model, StateHolder):
    model_name = "item"
    cli_name = "item"
    lifecycle = ItemLifecycle
    added_state_moves = tuple([ItemLifecycle.finish])


class Plain(Model):
    model_name = "plain"
    cli_name = "plain"
    lifecycle = ItemLifecycle


class Owner(Module):
    name = "owner"
    models = [ModelDeclaration(Item), ModelDeclaration(Plain)]


ADDED_STATE = AddedState("hold")
MOVES = (Move("hold", [ItemState.OPEN], ADDED_STATE), Move("unhold", [ADDED_STATE], ItemState.OPEN))


def module(*additions: StateAddition, dependencies: Sequence[str] = tuple(["owner"])) -> type[Module]:
    return type("Adder", tuple([Module]), {"name": "adder", "dependencies": list(dependencies), "added_states": additions})


def addition(**changes) -> StateAddition:
    values = {"holder": Item, "state": ADDED_STATE, "label": "On hold", "looks_like": ItemState.OPEN, "fallback_state": ItemState.OPEN, "moves": MOVES, **changes}
    return StateAddition(**values)


def problems(*additions: StateAddition, **options) -> str:
    return "; ".join(StateCheck().problems((Owner, module(*additions, **options))))


def test_a_good_addition_passes():
    assert problems(addition()) == ""


def test_a_model_that_holds_no_states_is_refused():
    assert "no state holder" in problems(addition(holder=Plain))


def test_the_module_must_depend_on_the_holders_module():
    assert "does not depend on owner" in problems(addition(), dependencies=())


def test_a_state_the_enum_has_is_refused():
    state = AddedState("open")
    assert "already has that state" in problems(addition(state=state, moves=(Move("hold", [ItemState.FINISHED], state), Move("unhold", [state], ItemState.FINISHED)), fallback_state=ItemState.FINISHED))


def test_two_modules_may_not_add_one_word():
    assert "adds that state too" in problems(addition(), addition())


def test_a_state_is_lowercase_letters_and_dashes():
    state = AddedState("On_Hold")
    assert "lowercase letters and dashes" in problems(addition(state=state, moves=(Move("hold", [ItemState.OPEN], state), Move("unhold", [state], ItemState.OPEN))))


def test_a_label_is_required():
    assert "no label" in problems(addition(label=" "))


def test_looks_like_and_fallback_are_the_holders_own_states():
    assert "looks_like and fallback_state" in problems(addition(looks_like=ADDED_STATE))


def test_a_state_needs_a_move_in_and_a_move_out():
    assert "a move in and a move out" in problems(addition(moves=MOVES[:1]))


def test_every_move_touches_the_state():
    assert "does not touch the state" in problems(addition(moves=(*MOVES, Move("skip", [ItemState.OPEN], ItemState.FINISHED))))


def test_a_move_out_never_skips_ahead():
    assert "skips ahead" in problems(addition(moves=(*MOVES, Move("jump", [ADDED_STATE], ItemState.FINISHED))))


def test_a_move_must_lead_to_the_fallback_state():
    assert "no move leads to its fallback state" in problems(addition(fallback_state=ItemState.FINISHED))


def test_a_move_name_of_the_holder_is_taken():
    assert "the move finish is taken" in problems(addition(moves=(Move("finish", [ItemState.OPEN], ADDED_STATE), MOVES[1])))

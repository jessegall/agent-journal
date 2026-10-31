from dataclasses import dataclass

import pytest

from core.base.change.change import Change
from core.base.command.handlers.make_handler import MakeHandler
from core.base.guard.guard import Guard
from core.base.model.lifecycle import Lifecycle
from core.base.model.model import Model
from core.base.model.move import Move
from core.base.model.tables import Tables
from core.base.registry.dotted_path import DottedPath
from core.base.module.module import Module
from core.base.module.module_check import ModuleCheck
from core.base.module.module_error import ModuleError
from core.base.module.noun import Noun
from tests.core.base.model.test_lifecycle import ItemState
from tests.core.base.model.test_model import Item


class PausedItemGuard(Guard):
    name = "items.paused-only"
    event = "item.pause"

    def check(self, change: Change[Model]) -> None:
        return None


class RenewedItemGuard(Guard):
    name = "items.renewed-only"
    event = "item.renew"

    def check(self, change: Change[Model]) -> None:
        return None


class UpdateMoveLifecycle(Lifecycle):
    states = ItemState
    initial = (ItemState.OPEN,)
    editable = ()
    deletable = ()

    update = Move("update", (ItemState.OPEN,), ItemState.PAUSED)


class UnreachedStateLifecycle(Lifecycle):
    states = ItemState
    initial = (ItemState.OPEN,)
    editable = ()
    deletable = ()

    pause = Move("pause", (ItemState.OPEN,), ItemState.PAUSED)


class NoFirstStateLifecycle(Lifecycle):
    states = ItemState
    initial = ()
    editable = ()
    deletable = ()

    pause = Move("pause", (ItemState.OPEN,), ItemState.PAUSED)


def model(lifecycle: type[Lifecycle], name: str = "book") -> type[Model]:
    return dataclass(frozen=True, kw_only=True)(type("Book", (Model,), {"model_name": name, "cli_noun": name, "lifecycle": lifecycle,
                                                                        "__annotations__": {"state": ItemState}, "state": ItemState.OPEN}))


def module(name: str, nouns: tuple[Noun, ...] = (), guards: tuple[type, ...] = (), handlers: tuple[type, ...] = ()) -> type[Module]:
    paths = {"guards": tuple(DottedPath.class_path(guard).text for guard in guards), "handlers": tuple(DottedPath.class_path(handler).text for handler in handlers)}
    return type(name.title() + "Module", (Module,), {"name": name, "requires_core": ">=5", "nouns": nouns, **paths})


def problems(*modules: type[Module]) -> str:
    with pytest.raises(ModuleError) as raised:
        ModuleCheck(Tables()).check(modules)
    return str(raised.value)


def test_every_event_of_every_model_is_known():
    events = ModuleCheck(Tables()).known_events((module("items", (Noun(Item),)),))
    assert events == ("item.create", "item.update", "item.delete", "item.metadata", "item.pause", "item.close")


def test_modules_without_problems_pass():
    ModuleCheck(Tables()).check((module("items", (Noun(Item),), (PausedItemGuard,)),))


def test_a_guard_on_an_event_no_model_raises_is_refused():
    assert "items.renewed-only covers item.renew, which no model raises" in problems(module("items", (Noun(Item),), (RenewedItemGuard,)))


def test_two_modules_with_one_model_name_and_table_are_refused():
    problem_text = problems(module("items", (Noun(Item),)), module("support", (Noun(Item),)))
    assert "two models named item" in problem_text and "two tables named items" in problem_text


def test_two_guards_with_one_name_are_refused():
    assert "two guards named items.paused-only" in problems(module("items", (Noun(Item),), (PausedItemGuard,)), module("support", (), (PausedItemGuard,)))


def test_a_move_named_like_a_standard_change_is_refused():
    assert "move update is named like a standard change" in problems(module("books", (Noun(model(UpdateMoveLifecycle)),)))


def test_a_state_no_move_reaches_is_refused():
    assert "state closed is no move's target and not a first state" in problems(module("books", (Noun(model(UnreachedStateLifecycle)),)))


def test_a_lifecycle_without_a_first_state_is_incomplete():
    assert "lifecycle is incomplete" in problems(module("books", (Noun(model(NoFirstStateLifecycle)),)))


def test_two_handlers_for_one_command_are_refused():
    assert "two handlers carry out" in problems(module("items", (Noun(Item),), handlers=(MakeHandler,)), module("support", handlers=(MakeHandler,)))

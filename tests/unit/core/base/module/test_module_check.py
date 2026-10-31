from core.base.module.window_check import WindowCheck
from core.base.module.mark_check import MarkCheck
from core.base.module.dock_check import DockCheck
from core.base.module.move_check import MoveCheck
from core.base.module.skill_check import SkillCheck
from core.base.module.button_check import ButtonCheck
from dataclasses import dataclass

import pytest

from core.base.change.change import Change
from core.base.command.handlers.make_handler import MakeHandler
from core.base.guard.guard import Guard
from core.base.model.lifecycle import Lifecycle
from core.base.model.model import Model
from core.base.model.move import Move
from core.base.model.tables import Tables
from core.base.module.module import Module
from core.base.module.driver_entries import DriverEntries
from core.base.module.module_check import ModuleCheck
from core.base.module.provider_check import ProviderCheck
from core.base.module.suite_check import SuiteCheck
from core.base.module.module_error import ModuleError
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.setting_check import SettingCheck
from tests.unit.core.base.model.test_lifecycle import ItemState
from tests.unit.core.base.model.test_model import Item


class PausedItemGuard(Guard):
    name = "items.paused-only"
    event = "item.pause"

    def check(self, change: Change[Model]) -> None:
        return None


class ArchivedItemGuard(Guard):
    name = "items.archived-only"
    event = "item.archive"

    def check(self, change: Change[Model]) -> None:
        return None


class UpdateMoveLifecycle(Lifecycle):
    states = ItemState
    initial = [ItemState.OPEN]
    editable = ()
    deletable = ()

    update = Move("update", [ItemState.OPEN], ItemState.PAUSED)


class UnreachableStateLifecycle(Lifecycle):
    states = ItemState
    initial = [ItemState.OPEN]
    editable = ()
    deletable = ()

    pause = Move("pause", [ItemState.OPEN], ItemState.PAUSED)


class NoFirstStateLifecycle(Lifecycle):
    states = ItemState
    initial = ()
    editable = ()
    deletable = ()

    pause = Move("pause", [ItemState.OPEN], ItemState.PAUSED)


def model(lifecycle: type[Lifecycle], name: str = "book") -> type[Model]:
    return dataclass(frozen=True, kw_only=True)(type("Book", tuple([Model]), {"model_name": name, "cli_name": name, "lifecycle": lifecycle,
                                                                        "__annotations__": {"state": ItemState}, "state": ItemState.OPEN}))


def module(name: str, models: tuple[ModelDeclaration, ...] = (), guards: tuple[type, ...] = (), handlers: tuple[type, ...] = ()) -> type[Module]:
    return type(name.title() + "Module", tuple([Module]), {"name": name, "requires_core": ">=5", "models": models, "guards": guards, "handlers": handlers})


def problems(*modules: type[Module]) -> str:
    with pytest.raises(ModuleError) as raised:
        module_check().check(modules, DriverEntries().rules(modules))
    return str(raised.value)


def test_every_event_of_every_model_is_known():
    events = module_check().known_events([module("items", [ModelDeclaration(Item)])])
    assert events == ("item.create", "item.update", "item.delete", "item.metadata", "item.pause", "item.close")


def test_modules_without_problems_pass():
    module_check().check([module("items", [ModelDeclaration(Item)], [PausedItemGuard])], ())


def test_a_guard_on_an_event_no_model_raises_is_refused():
    assert "items.archived-only covers item.archive, which no model raises" in problems(module("items", [ModelDeclaration(Item)], [ArchivedItemGuard]))


def test_two_modules_with_one_model_name_and_table_are_refused():
    problem_text = problems(module("items", [ModelDeclaration(Item)]), module("support", [ModelDeclaration(Item)]))
    assert "two models named item" in problem_text and "two tables named items" in problem_text


def test_two_guards_with_one_name_are_refused():
    assert "two guards, listeners or driver rules named items.paused-only" in problems(module("items", [ModelDeclaration(Item)], [PausedItemGuard]), module("support", (), [PausedItemGuard]))


def test_a_move_named_like_a_standard_change_is_refused():
    assert "move update is named like a standard change" in problems(module("books", [ModelDeclaration(model(UpdateMoveLifecycle))]))


def test_a_state_no_move_reaches_is_refused():
    assert "state closed is no move's target and not a first state" in problems(module("books", [ModelDeclaration(model(UnreachableStateLifecycle))]))


def test_a_lifecycle_without_a_first_state_is_incomplete():
    assert "lifecycle is incomplete" in problems(module("books", [ModelDeclaration(model(NoFirstStateLifecycle))]))


def test_two_handlers_for_one_command_are_refused():
    assert "two handlers carry out" in problems(module("items", [ModelDeclaration(Item)], handlers=[MakeHandler]), module("support", handlers=[MakeHandler]))


def module_check() -> ModuleCheck:
    return ModuleCheck(Tables(), SuiteCheck(), WindowCheck(), ProviderCheck(), MarkCheck(ButtonCheck()), DockCheck(ButtonCheck()), SettingCheck(), SkillCheck(), MoveCheck())


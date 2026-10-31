from dataclasses import dataclass

import pytest

from core.base.change.change import Change
from core.base.command.handlers.make_handler import MakeHandler
from core.base.guard.guard import Guard
from core.base.model.lifecycle import Lifecycle
from core.base.model.model import Model
from core.base.model.move import Move
from core.base.model.tables import Tables
from core.base.module.dotted_path import DottedPath
from core.base.module.module import Module
from core.base.module.module_check import ModuleCheck
from core.base.module.module_error import ModuleError
from core.base.module.noun import Noun
from tests.core.base.test_lifecycle import LoanState
from tests.core.base.test_model import Loan


class LateLoansOnly(Guard):
    name = "loans.late-only"
    event = "loan.overdue"

    def check(self, change: Change[Model]) -> None:
        return None


class RenewedLoansOnly(Guard):
    name = "loans.renewed-only"
    event = "loan.renew"

    def check(self, change: Change[Model]) -> None:
        return None


class UpdateMoveLifecycle(Lifecycle):
    states = LoanState
    initial = (LoanState.LENT,)
    editable = ()
    deletable = ()

    update = Move("update", (LoanState.LENT,), LoanState.LATE)


class UnreachedStateLifecycle(Lifecycle):
    states = LoanState
    initial = (LoanState.LENT,)
    editable = ()
    deletable = ()

    overdue = Move("overdue", (LoanState.LENT,), LoanState.LATE)


class NoFirstStateLifecycle(Lifecycle):
    states = LoanState
    initial = ()
    editable = ()
    deletable = ()

    overdue = Move("overdue", (LoanState.LENT,), LoanState.LATE)


def model(lifecycle: type[Lifecycle], name: str = "book") -> type[Model]:
    return dataclass(frozen=True, kw_only=True)(type("Book", (Model,), {"name": name, "cli_noun": name, "lifecycle": lifecycle,
                                                                        "__annotations__": {"state": LoanState}, "state": LoanState.LENT}))


def module(name: str, nouns: tuple[Noun, ...] = (), guards: tuple[type, ...] = (), handlers: tuple[type, ...] = ()) -> type[Module]:
    paths = {"guards": tuple(DottedPath.class_path(guard).text for guard in guards), "handlers": tuple(DottedPath.class_path(handler).text for handler in handlers)}
    return type(name.title() + "Module", (Module,), {"name": name, "requires_core": ">=5", "nouns": nouns, **paths})


def problems(*modules: type[Module]) -> str:
    with pytest.raises(ModuleError) as caught:
        ModuleCheck(Tables()).check(modules)
    return str(caught.value)


def test_every_event_of_every_model_is_known():
    events = ModuleCheck(Tables()).known_events((module("loans", (Noun(Loan),)),))
    assert events == ("loan.create", "loan.update", "loan.delete", "loan.metadata", "loan.overdue", "loan.bring_back")


def test_modules_without_problems_pass():
    ModuleCheck(Tables()).check((module("loans", (Noun(Loan),), (LateLoansOnly,)),))


def test_a_guard_on_an_event_no_model_raises_is_refused():
    assert "loans.renewed-only covers loan.renew, which no model raises" in problems(module("loans", (Noun(Loan),), (RenewedLoansOnly,)))


def test_two_modules_with_one_model_name_and_table_are_refused():
    found = problems(module("loans", (Noun(Loan),)), module("library", (Noun(Loan),)))
    assert "two models named loan" in found and "two tables named loans" in found


def test_two_guards_with_one_name_are_refused():
    assert "two guards named loans.late-only" in problems(module("loans", (Noun(Loan),), (LateLoansOnly,)), module("library", (), (LateLoansOnly,)))


def test_a_move_named_like_a_standard_change_is_refused():
    assert "move update is named like a standard change" in problems(module("books", (Noun(model(UpdateMoveLifecycle)),)))


def test_a_state_no_move_reaches_is_refused():
    assert "state returned is no move's target and not a first state" in problems(module("books", (Noun(model(UnreachedStateLifecycle)),)))


def test_a_lifecycle_without_a_first_state_is_incomplete():
    assert "lifecycle is incomplete" in problems(module("books", (Noun(model(NoFirstStateLifecycle)),)))


def test_two_handlers_for_one_command_are_refused():
    assert "two handlers carry out" in problems(module("loans", (Noun(Loan),), handlers=(MakeHandler,)), module("library", handlers=(MakeHandler,)))

from dataclasses import dataclass

import pytest

from core.base.change.event_pattern import EventPattern
from core.base.command.delete_command import DeleteCommand
from core.base.command.edit_command import EditCommand
from core.base.command.handlers.delete_handler import DeleteHandler
from core.base.command.handlers.edit_handler import EditHandler
from core.base.command.handlers.make_handler import MakeHandler
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.guard.lifecycle_guard import LifecycleGuard
from core.base.guard_refusal import GuardRefusal
from core.base.module.dotted_path import DottedPath
from core.base.module.guard_entry import GuardEntry
from core.base.module.registry import Registry
from core.base.repository.repository import Repository
from tests.core.base.harness import context, harness
from tests.core.base.test_commands import LoanMake
from tests.core.base.test_lifecycle import LoanLifecycle, LoanState
from tests.core.base.test_model import Loan


@dataclass(frozen=True)
class LoanRetitle(EditCommand[Loan]):
    title: str | None = None


@dataclass(frozen=True)
class LoanDelete(DeleteCommand):
    deleted_model = Loan


@pytest.fixture
def container(tmp_path):
    lifecycle = GuardEntry(LifecycleGuard.name, EventPattern("*"), DottedPath.class_path(LifecycleGuard), 1, "")
    return harness(tmp_path, Registry("abc", {}, {}, {}, (lifecycle,), ()))


def test_a_make_command_builds_and_saves_a_new_row(container):
    made = container.get(MakeHandler).handle(LoanMake(title="Dune"), context(LoanMake(title="Dune")))
    assert (made.id, made.title, made.state) == (1, "Dune", LoanState.LENT)


def test_an_edit_changes_only_the_fields_it_gives(container):
    container.get(MakeHandler).handle(LoanMake(title="Dune"), context(LoanMake(title="Dune")))
    edited = container.get(EditHandler).handle(LoanRetitle(row_id=1, title="Dune Messiah"), context(LoanRetitle(row_id=1)))
    assert (edited.title, edited.state, edited.version) == ("Dune Messiah", LoanState.LENT, 2)
    unchanged = container.get(EditHandler).handle(LoanRetitle(row_id=1), context(LoanRetitle(row_id=1)))
    assert unchanged.version == 2


def test_an_edit_in_a_state_that_allows_none_is_refused(container):
    made = container.get(MakeHandler).handle(LoanMake(title="Dune"), context(LoanMake(title="Dune")))
    container.get(Repository).save(made.moved(LoanLifecycle.bring_back), context(LoanMake(title="Dune")))
    with pytest.raises(GuardRefusal, match="cannot be edited"):
        container.get(EditHandler).handle(LoanRetitle(row_id=1, title="Emma"), context(LoanRetitle(row_id=1)))


def test_a_delete_command_deletes_the_row(container):
    container.get(MakeHandler).handle(LoanMake(title="Dune"), context(LoanMake(title="Dune")))
    container.get(DeleteHandler).handle(LoanDelete(row_id=1), context(LoanDelete(row_id=1)))
    assert container.get(Database).rows(Statement("SELECT count(*) FROM loans"))[0][0] == 0

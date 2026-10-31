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
from core.base.registry.dotted_path import DottedPath
from core.base.registry.guard_entry import GuardEntry
from core.base.registry.registry import Registry
from core.base.repository.repository import Repository
from tests.core.base.harness import context, harness
from tests.core.base.command.test_commands import ItemMake
from tests.core.base.model.test_lifecycle import ItemLifecycle, ItemState
from tests.core.base.model.test_model import Item


@dataclass(frozen=True)
class ItemRetitle(EditCommand[Item]):
    title: str | None = None


@dataclass(frozen=True)
class ItemDelete(DeleteCommand):
    deleted_model = Item


@pytest.fixture
def container(tmp_path):
    lifecycle = GuardEntry(LifecycleGuard.name, EventPattern("*"), DottedPath.class_path(LifecycleGuard), 1, "")
    return harness(tmp_path, Registry("abc", {}, {}, {}, (lifecycle,), ()))


def test_a_make_command_builds_and_saves_a_new_row(container):
    item = container.get(MakeHandler).handle(ItemMake(title="Dune"), context(ItemMake(title="Dune")))
    assert (item.id, item.title, item.state) == (1, "Dune", ItemState.OPEN)


def test_an_edit_changes_only_the_fields_it_gives(container):
    container.get(MakeHandler).handle(ItemMake(title="Dune"), context(ItemMake(title="Dune")))
    edited = container.get(EditHandler).handle(ItemRetitle(row_id=1, title="Dune Messiah"), context(ItemRetitle(row_id=1)))
    assert (edited.title, edited.state, edited.version) == ("Dune Messiah", ItemState.OPEN, 2)
    unchanged = container.get(EditHandler).handle(ItemRetitle(row_id=1), context(ItemRetitle(row_id=1)))
    assert unchanged.version == 2


def test_an_edit_in_a_state_that_allows_none_is_refused(container):
    item = container.get(MakeHandler).handle(ItemMake(title="Dune"), context(ItemMake(title="Dune")))
    container.get(Repository).save(item.moved(ItemLifecycle.close), context(ItemMake(title="Dune")))
    with pytest.raises(GuardRefusal, match="cannot be edited"):
        container.get(EditHandler).handle(ItemRetitle(row_id=1, title="Emma"), context(ItemRetitle(row_id=1)))


def test_a_delete_command_deletes_the_row(container):
    container.get(MakeHandler).handle(ItemMake(title="Dune"), context(ItemMake(title="Dune")))
    container.get(DeleteHandler).handle(ItemDelete(row_id=1), context(ItemDelete(row_id=1)))
    assert container.get(Database).rows(Statement("SELECT count(*) FROM items"))[0][0] == 0

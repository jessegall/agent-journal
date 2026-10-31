from dataclasses import dataclass

import pytest

from core.base.actor import Actor
from core.base.change.event_pattern import EventPattern
from core.base.command.handlers.move_handler import MoveHandler
from core.base.command.move_command import MoveCommand
from core.base.guard.lifecycle_guard import LifecycleGuard
from core.base.guard.guard_refusal import GuardRefusal
from core.base.registry.dotted_path import DottedPath
from core.base.registry.guard_entry import GuardEntry
from core.base.registry.registry import Registry
from core.base.timestamp import Timestamp
from core.base.repository.repository import Repository
from tests.unit.core.base.sample_container import context, sample_container
from tests.unit.core.base.command.test_commands import MakeItem
from tests.unit.core.base.model.test_lifecycle import ItemLifecycle, ItemState
from tests.unit.core.base.model.test_model import Item


@dataclass(frozen=True, kw_only=True)
class ReturnableItem(Item):
    def close(self, timestamp: Timestamp, actor: Actor) -> "ReturnableItem":
        return self.moved(ItemLifecycle.close, title=f"{self.title} (closed)")


@dataclass(frozen=True)
class ItemPause(MoveCommand[Item]):
    move = ItemLifecycle.pause


@dataclass(frozen=True)
class CloseItem(MoveCommand[ReturnableItem]):
    move = ItemLifecycle.close


@pytest.fixture
def container(tmp_path):
    lifecycle = GuardEntry(LifecycleGuard.name, EventPattern("*"), DottedPath.class_path(LifecycleGuard), 1, "")
    built = sample_container(tmp_path, Registry("abc", {}, {}, {}, [lifecycle], ()))
    built.get(Repository).save(ReturnableItem(title="Dune"), context(MakeItem(title="Dune")))
    return built


def test_a_move_the_model_writes_no_method_for_sets_only_the_state(container):
    moved = container.get(MoveHandler).handle(ItemPause(row_id=1), context(ItemPause(row_id=1)))
    assert (moved.state, moved.version) == (ItemState.PAUSED, 2)


def test_a_move_the_model_has_a_method_for_sets_its_own_fields_too(container):
    moved = container.get(MoveHandler).handle(CloseItem(row_id=1), context(CloseItem(row_id=1)))
    assert isinstance(moved, ReturnableItem) and (moved.state, moved.title) == (ItemState.CLOSED, "Dune (closed)")


def test_a_move_from_the_wrong_state_is_refused_by_the_lifecycle(container):
    container.get(MoveHandler).handle(CloseItem(row_id=1), context(CloseItem(row_id=1)))
    with pytest.raises(GuardRefusal, match="item 1 is closed, so it cannot pause"):
        container.get(MoveHandler).handle(ItemPause(row_id=1), context(ItemPause(row_id=1)))

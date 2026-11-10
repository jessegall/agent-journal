from typing import Generic, TypeVar

import pytest

from engine.change.changed import Changed
from engine.change.created import Created
from engine.change.event_pattern import EventPattern
from engine.change.event_pattern_error import EventPatternError
from engine.change.event_subscriber import E, EventSubscriber
from engine.change.event_type import EventType
from engine.change.journal_booting import JournalBooting
from engine.change.moved import Moved
from engine.change.registry_synced import RegistrySynced
from engine.change.touched import Touched
from engine.change.updated import Updated
from engine.change.upgrade_finished import UpgradeFinished
from core.base.model.model import Model
from tests.unit.core.base.model.test_lifecycle import ItemLifecycle
from tests.unit.core.base.model.test_model import Item

F = TypeVar("F")


class SharedBase(EventSubscriber[E]):
    """A shared base that leaves the event open."""


class SecondBase(SharedBase[F], Generic[F]):
    """A second layer of shared base."""


class ItemMovedLeaf(SecondBase[Moved[Item]]):
    """A leaf under two layers of generic bases."""

    moves = tuple([ItemLifecycle.pause])


class UnionLeaf(EventSubscriber[Created[Item] | Updated[Item]]):
    """A leaf that hears two events."""


def test_a_created_row_has_its_own_pattern():
    assert Created.pattern(Item, ()) == "item.create"


def test_moved_gives_one_name_per_move():
    assert Moved.pattern(Item, (ItemLifecycle.pause, ItemLifecycle.close)) == "item.pause|item.close"


def test_moved_with_no_moves_is_refused():
    with pytest.raises(EventPatternError):
        EventPattern(Moved.pattern(Item, ()))


def test_changed_of_any_model_and_touched_of_any_model_have_wide_patterns():
    assert Changed.pattern(Model, ()) == "*.*"
    assert Touched.pattern(Model, ()) == "*"


def test_a_leaf_under_two_generic_bases_reads_its_type_parameter():
    assert ItemMovedLeaf.event == "item.pause"
    assert ItemMovedLeaf.event_type("item.pause").event_class is Moved


def test_a_union_gives_a_pattern_and_the_event_type_for_a_name():
    assert UnionLeaf.event == "item.create|item.update"
    assert UnionLeaf.event_type("item.update").event_class is Updated


def test_each_system_event_has_its_name():
    assert EventType.parsed(JournalBooting).pattern(()) == "journal.booting"
    assert EventType.parsed(RegistrySynced).pattern(()) == "registry.sync"
    assert EventType.parsed(UpgradeFinished).pattern(()) == "upgrade.finished"

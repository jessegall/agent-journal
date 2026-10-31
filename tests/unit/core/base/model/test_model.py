from dataclasses import dataclass
from datetime import datetime, timezone

import pytest

from core.base.model.model import Model, ModelError
from core.base.model.move import Move
from core.base.timestamp import Timestamp
from tests.unit.core.base.model.test_lifecycle import ItemLifecycle, ItemState

AT = Timestamp(datetime(2026, 10, 31, 9, tzinfo=timezone.utc))


@dataclass(frozen=True, kw_only=True)
class Item(Model):
    model_name = "item"
    cli_name = "item"
    lifecycle = ItemLifecycle

    title: str
    state: ItemState = ItemState.OPEN


def test_a_change_is_a_copy_and_the_original_stays():
    item = Item(title="Dune")
    renamed = item.changed(title="Dune Messiah")
    assert (item.title, renamed.title) == ("Dune", "Dune Messiah")


def test_a_change_cannot_set_the_state():
    with pytest.raises(ModelError, match="ask for a move"):
        Item(title="Dune").changed(state=ItemState.CLOSED)


def test_a_move_sets_the_state_and_carries_the_move():
    moved = Item(title="Dune").moved(ItemLifecycle.pause)
    assert moved.state is ItemState.PAUSED and moved.move is ItemLifecycle.pause


def test_a_move_of_another_lifecycle_is_refused():
    with pytest.raises(ModelError, match="no move of Item"):
        Item(title="Dune").moved(Move("pause", [ItemState.OPEN], ItemState.CLOSED))


def test_saving_gives_the_id_version_and_timestamps_and_drops_the_move():
    saved = Item(title="Dune").moved(ItemLifecycle.pause).saved(4, 1, AT)
    assert (saved.id, saved.version, saved.created_at, saved.updated_at, saved.move) == (4, 1, AT, AT, None)
    assert saved.is_saved and not Item(title="Dune").is_saved


def test_the_move_asked_for_does_not_count_in_equality():
    assert Item(title="Dune", state=ItemState.PAUSED) == Item(title="Dune").moved(ItemLifecycle.pause)

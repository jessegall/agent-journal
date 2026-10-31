from enum import StrEnum

from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move


class ItemState(StrEnum):
    OPEN = "open"
    PAUSED = "paused"
    CLOSED = "closed"


class ItemLifecycle(Lifecycle):
    states = ItemState
    initial = [ItemState.OPEN]
    editable = (ItemState.OPEN, ItemState.PAUSED)
    deletable = [ItemState.OPEN]

    pause = Move("pause", [ItemState.OPEN], ItemState.PAUSED)
    close = Move("close", (ItemState.OPEN, ItemState.PAUSED), ItemState.CLOSED)


class MisnamedLifecycle(Lifecycle):
    states = ItemState
    initial = [ItemState.OPEN]
    editable = ()
    deletable = ()

    pause = Move("overdo", [ItemState.OPEN], ItemState.PAUSED)


def test_the_moves_are_listed_in_the_order_they_are_written():
    assert [move.name for move in ItemLifecycle.moves()] == ["pause", "close"]


def test_a_move_named_unlike_its_attribute_is_found():
    assert ItemLifecycle.misnamed_moves() == []
    assert MisnamedLifecycle.misnamed_moves() == ["pause"]


def test_the_way_out_names_every_move_from_the_state_a_row_is_in():
    assert ItemLifecycle.suggestion("item", 4, ItemState.PAUSED) == "from paused it can only go on with journal item close 4"
    assert ItemLifecycle.suggestion("item", 4, ItemState.OPEN) == "from open it can only go on with journal item pause 4, journal item close 4"


def test_a_state_no_move_leaves_is_final():
    assert ItemLifecycle.suggestion("item", 4, ItemState.CLOSED) == "closed is final"

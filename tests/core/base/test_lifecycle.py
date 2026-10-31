from enum import StrEnum

from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move


class LoanState(StrEnum):
    LENT = "lent"
    LATE = "late"
    RETURNED = "returned"


class LoanLifecycle(Lifecycle):
    states = LoanState
    initial = (LoanState.LENT,)
    editable = (LoanState.LENT, LoanState.LATE)
    deletable = (LoanState.LENT,)

    overdue = Move("overdue", (LoanState.LENT,), LoanState.LATE)
    bring_back = Move("bring_back", (LoanState.LENT, LoanState.LATE), LoanState.RETURNED)


class MisnamedLifecycle(Lifecycle):
    states = LoanState
    initial = (LoanState.LENT,)
    editable = ()
    deletable = ()

    overdue = Move("overdo", (LoanState.LENT,), LoanState.LATE)


def test_the_moves_are_listed_in_the_order_they_are_written():
    assert [move.name for move in LoanLifecycle.moves()] == ["overdue", "bring_back"]


def test_a_move_named_unlike_its_attribute_is_found():
    assert LoanLifecycle.misnamed_moves() == ()
    assert MisnamedLifecycle.misnamed_moves() == ("overdue",)


def test_the_way_out_names_every_move_from_the_state_a_row_is_in():
    assert LoanLifecycle.suggestion("loan", 4, LoanState.LATE) == "from late it can only go on with journal loan bring_back 4"
    assert LoanLifecycle.suggestion("loan", 4, LoanState.LENT) == "from lent it can only go on with journal loan overdue 4, journal loan bring_back 4"


def test_a_state_no_move_leaves_is_final():
    assert LoanLifecycle.suggestion("loan", 4, LoanState.RETURNED) == "returned is final"

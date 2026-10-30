from dataclasses import dataclass
from datetime import datetime, timezone

import pytest

from core.base.model.model import Model, ModelFault
from core.base.model.move import Move
from core.base.moment import Moment
from tests.core.base.test_lifecycle import LoanLifecycle, LoanState

AT = Moment(datetime(2026, 10, 31, 9, tzinfo=timezone.utc))


@dataclass(frozen=True, kw_only=True)
class Loan(Model):
    name = "loan"
    cli_noun = "loan"
    lifecycle = LoanLifecycle

    title: str
    state: LoanState = LoanState.LENT


def test_a_change_is_a_copy_and_the_original_stays():
    loan = Loan(title="Dune")
    renamed = loan.changed(title="Dune Messiah")
    assert (loan.title, renamed.title) == ("Dune", "Dune Messiah")


def test_a_change_cannot_set_the_state():
    with pytest.raises(ModelFault, match="ask for a move"):
        Loan(title="Dune").changed(state=LoanState.RETURNED)


def test_a_move_sets_the_state_and_carries_the_move():
    moved = Loan(title="Dune").moved(LoanLifecycle.overdue)
    assert moved.state is LoanState.LATE and moved.move is LoanLifecycle.overdue


def test_a_move_of_another_lifecycle_is_refused():
    with pytest.raises(ModelFault, match="no move of Loan"):
        Loan(title="Dune").moved(Move("overdue", (LoanState.LENT,), LoanState.RETURNED))


def test_saving_gives_the_id_version_and_moments_and_drops_the_move():
    saved = Loan(title="Dune").moved(LoanLifecycle.overdue).saved(4, 1, AT)
    assert (saved.id, saved.version, saved.created_at, saved.updated_at, saved.move) == (4, 1, AT, AT, None)
    assert saved.is_saved and not Loan(title="Dune").is_saved


def test_the_move_asked_for_does_not_count_in_equality():
    assert Loan(title="Dune", state=LoanState.LATE) == Loan(title="Dune").moved(LoanLifecycle.overdue)

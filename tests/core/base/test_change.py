from datetime import datetime, timezone

from core.base.actor import Actor, ActorType
from core.base.change.change import Change
from core.base.command.context import Context
from core.base.moment import Moment
from tests.core.base.test_commands import LoanMake
from tests.core.base.test_lifecycle import LoanLifecycle, LoanState
from tests.core.base.test_model import Loan

AT = Moment(datetime(2026, 10, 31, 9, tzinfo=timezone.utc))
CONTEXT = Context(Actor(7, ActorType.AGENT), AT, LoanMake(title="Dune"))
STORED = Loan(id=4, version=1, title="Dune")


def test_a_new_row_is_a_create():
    assert Change(None, Loan(title="Dune"), CONTEXT).event == "loan.create"


def test_a_deletion_is_a_delete():
    assert Change(STORED, None, CONTEXT).event == "loan.delete"


def test_a_move_is_named_for_the_move():
    assert Change(STORED, STORED.moved(LoanLifecycle.overdue), CONTEXT).event == "loan.overdue"


def test_changed_fields_without_a_move_are_an_update_and_metadata_is_not_one_of_them():
    change = Change(STORED, STORED.changed(title="Dune Messiah"), CONTEXT)
    assert (change.event, change.fields) == ("loan.update", ("title",))


def test_a_save_that_changes_nothing_is_empty():
    assert Change(STORED, STORED, CONTEXT).is_empty
    assert not Change(None, Loan(title="Dune"), CONTEXT).is_empty


def test_a_move_from_the_state_the_row_is_in_is_still_that_move():
    late = Loan(id=4, version=1, title="Dune", state=LoanState.LATE)
    change = Change(late, late.moved(LoanLifecycle.overdue), CONTEXT)
    assert (change.event, change.is_empty) == ("loan.overdue", False)

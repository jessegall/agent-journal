from dataclasses import dataclass
from datetime import datetime, timezone

from core.base.actor import Actor, ActorType
from core.base.command.context import Context
from core.base.command.delete_command import DeleteCommand
from core.base.command.edit_command import EditCommand
from core.base.command.make_command import MakeCommand
from core.base.command.move_command import MoveCommand
from core.base.moment import Moment
from tests.core.base.test_lifecycle import LoanLifecycle
from tests.core.base.test_model import Loan

AT = Moment(datetime(2026, 10, 31, 9, tzinfo=timezone.utc))


@dataclass(frozen=True)
class LoanOverdue(MoveCommand[Loan]):
    move = LoanLifecycle.overdue
    reason: str


@dataclass(frozen=True)
class LoanMake(MakeCommand[Loan]):
    title: str


@dataclass(frozen=True)
class LoanEdit(EditCommand[Loan]):
    title: str | None = None


@dataclass(frozen=True)
class LoanDelete(DeleteCommand):
    deleted_model = Loan


def test_a_command_names_the_model_it_works_on():
    assert (LoanOverdue.model(), LoanMake.model(), LoanEdit.model(), LoanDelete.model()) == (Loan, Loan, Loan, Loan)


def test_a_move_command_hands_on_only_its_own_fields():
    assert LoanOverdue(row_id=4, reason="a week late").move_fields() == {"reason": "a week late"}


def test_an_edit_hands_on_only_the_fields_given():
    assert LoanEdit(row_id=4).changed_fields() == {}
    assert LoanEdit(row_id=4, title="Dune Messiah").changed_fields() == {"title": "Dune Messiah"}


def test_a_nested_context_keeps_who_when_and_the_skipped_guards_and_names_its_own_command():
    outer = Context(Actor(7, ActorType.AGENT), AT, LoanMake(title="Dune"), frozenset({"messages.one-reply-per-message"}), cause_id=12)
    inner = outer.nested(LoanOverdue(row_id=4, reason="late"))
    assert (inner.actor, inner.moment, inner.skipped_guards, inner.cause_id) == (outer.actor, outer.moment, outer.skipped_guards, 12)
    assert inner.command == LoanOverdue(row_id=4, reason="late")

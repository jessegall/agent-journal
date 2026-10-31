import pytest

from core.base.change.change import Change
from core.base.change.event_log import EventLog
from core.base.change.event_pattern import EventPattern
from core.base.container import Container
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.listener.deletion_listener import DeletionListener
from core.base.model.model import Model
from core.base.module.dotted_path import DottedPath
from core.base.module.listener_entry import ListenerEntry, ListenerTiming
from core.base.module.registry import Registry
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from tests.core.base.harness import context, empty_registry, harness
from tests.core.base.test_commands import LoanMake
from tests.core.base.test_model import Loan

NOTES = "CREATE TABLE loan_notes (id INTEGER PRIMARY KEY, loan_id INTEGER NOT NULL REFERENCES loans(id) ON DELETE RESTRICT) STRICT"


class ClearLoanNotes(DeletionListener):
    """Removes a loan's notes before the loan is deleted."""

    name = "notes.clear"
    event = "loan.delete"

    def __init__(self, database: Database) -> None:
        self.database = database

    def handle(self, change: Change[Model]) -> None:
        self.database.update(Statement("DELETE FROM loan_notes WHERE loan_id = ?", (change.row.id,)))


def with_note(container: Container) -> Loan:
    database = container.get(Database)
    database.update(Statement(NOTES))
    loan = container.get(Repository).save(Loan(title="Dune"), context(LoanMake(title="Dune")))
    database.insert(Statement("INSERT INTO loan_notes (loan_id) VALUES (?)", (loan.id,)))
    return loan


def test_a_deletion_listener_clears_what_points_at_the_row_first(tmp_path):
    registry = Registry("abc", {}, {}, {}, (), (ListenerEntry(ClearLoanNotes.name, EventPattern(ClearLoanNotes.event), ListenerTiming.DELETION,
                                                               DottedPath.class_path(ClearLoanNotes), 1),))
    container = harness(tmp_path, registry)
    loan = with_note(container)
    with container.get(Database).transaction():
        container.get(Repository).delete(loan, context(LoanMake(title="Dune")))
    assert container.get(Database).rows(Statement("SELECT count(*) FROM loan_notes"))[0][0] == 0
    assert container.get(EventLog).event(container.get(EventLog).newest_id()).event == "loan.delete"


def test_a_row_still_pointed_at_is_refused_naming_the_table_that_points(tmp_path):
    container = harness(tmp_path, empty_registry())
    loan = with_note(container)
    with pytest.raises(Refusal, match="this loan is still referred to by loan_notes"):
        container.get(Repository).delete(loan, context(LoanMake(title="Dune")))

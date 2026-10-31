from dataclasses import replace

import pytest

from core.base.change.event_log import EventLog
from core.base.change.event_pattern import EventPattern
from core.base.container import Container
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.guard_refusal import GuardRefusal
from core.base.model.model import Model
from core.base.registry.dotted_path import DottedPath
from core.base.registry.guard_entry import GuardEntry
from core.base.registry.listener_entry import ListenerEntry, ListenerTiming
from core.base.registry.registry import Registry
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.repository.stale_row import StaleRow
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.listener.save_listener import SaveListener
from tests.core.base.harness import context, empty_registry, harness
from tests.core.base.test_commands import LoanMake
from tests.core.base.test_lifecycle import LoanLifecycle
from tests.core.base.test_model import Loan

SEEN: list[str] = []


class NoTitleDune(Guard):
    """No loan is titled Dune Messiah."""

    name = "loans.no-dune-messiah"
    event = "loan.update"

    def check(self, change: Change[Model]) -> None:
        SEEN.append("guard")
        raise Refusal("Dune Messiah is out of print")


class EventCounter(SaveListener):
    """Records how many events the log holds when it runs."""

    name = "loans.count-events"
    event = "loan.*"

    def __init__(self, database: Database) -> None:
        self.database = database

    def handle(self, change: Change[Model]) -> None:
        SEEN.append(f"events {self.database.rows(Statement('SELECT count(*) FROM events'))[0][0]}")


@pytest.fixture
def container(tmp_path):
    SEEN.clear()
    registry = Registry("abc", {}, {}, {}, (GuardEntry(NoTitleDune.name, EventPattern(NoTitleDune.event), DottedPath.class_path(NoTitleDune), 1, ""),),
                        (ListenerEntry(EventCounter.name, EventPattern(EventCounter.event), ListenerTiming.SAVE, DottedPath.class_path(EventCounter), 1),))
    return harness(tmp_path, registry)


def save(container: Container, loan: Loan) -> Loan:
    return container.get(Repository).save(loan, context(LoanMake(title=loan.title)))


def test_a_new_row_gets_an_id_a_first_version_and_both_moments(container: Container):
    saved = save(container, Loan(title="Dune"))
    assert (saved.id, saved.version, saved.created_at is not None) == (1, 1, True)


def test_only_the_changed_fields_are_written_and_the_version_rises(container: Container):
    saved = save(container, Loan(title="Dune"))
    moved = save(container, saved.moved(LoanLifecycle.overdue))
    assert (moved.version, moved.state.value) == (2, "late")
    assert container.get(EventLog).event(2).data == {"state": ("lent", "late")}


def test_a_copy_read_before_another_change_is_refused(container: Container):
    saved = save(container, Loan(title="Dune"))
    save(container, saved.moved(LoanLifecycle.overdue))
    with pytest.raises(StaleRow, match="loan 1 changed since it was read"):
        save(container, saved.moved(LoanLifecycle.bring_back))


def test_a_save_that_changes_nothing_writes_and_logs_nothing(container: Container):
    saved = save(container, Loan(title="Dune"))
    assert save(container, saved) == saved
    assert container.get(EventLog).newest_id() == 1


def test_guards_are_asked_before_anything_is_written(container: Container):
    saved = save(container, Loan(title="Dune"))
    with pytest.raises(GuardRefusal, match="out of print"):
        save(container, saved.changed(title="Dune Messiah"))
    assert container.get(Database).rows(Statement("SELECT title FROM loans"))[0][0] == "Dune"


def test_the_change_is_logged_before_a_save_listener_runs(container: Container):
    save(container, Loan(title="Dune"))
    assert SEEN == ["events 1"]


def test_a_constraint_failure_becomes_a_refusal(container: Container):
    save(container, Loan(title="Dune"))
    with pytest.raises(Refusal, match="a loan with that title exists already"):
        save(container, Loan(title="Dune"))


def test_a_deleted_row_is_gone_and_logged(tmp_path):
    container = harness(tmp_path, empty_registry())
    saved = container.get(Repository).save(Loan(title="Dune"), context(LoanMake(title="Dune")))
    with pytest.raises(StaleRow):
        container.get(Repository).delete(replace(saved, version=5), context(LoanMake(title="Dune")))
    container.get(Repository).delete(saved, context(LoanMake(title="Dune")))
    assert container.get(Database).rows(Statement("SELECT count(*) FROM loans"))[0][0] == 0
    assert container.get(EventLog).event(2).event == "loan.delete"

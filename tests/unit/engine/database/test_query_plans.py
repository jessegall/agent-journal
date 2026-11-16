import pytest

from engine.database.errors.repeated_calls_error import RepeatedCallsError
from engine.database.query_plans import QueryPlans
from engine.database.repeated_work import RepeatedWork
from engine.database.statement import Statement

LOOKUP = "SELECT id FROM tasks WHERE id = ?"


class PlannedDatabase:
    """A stand-in database that counts how often it is asked for a query plan."""

    def __init__(self) -> None:
        self.plans_asked = 0

    def content_mark(self) -> tuple[int, int, int]:
        return (1, 0, 0)

    def query_plan(self, statement: Statement) -> tuple[str, ...]:
        self.plans_asked += 1
        return ("SEARCH tasks USING INTEGER PRIMARY KEY (rowid=?)",)

    def is_partial_index(self, name: str) -> bool:
        return False


@pytest.fixture(autouse=True)
def no_kept_plans():
    QueryPlans.plans.clear()
    yield
    QueryPlans.plans.clear()


def first_read(database: PlannedDatabase, task_id: int) -> None:
    work = RepeatedWork(database)
    with work.request():
        work.mark_read()
        work.loaded([], Statement(LOOKUP, [task_id]))


def test_a_query_shape_is_planned_once_across_two_repeated_works():
    database = PlannedDatabase()
    first_read(database, 1)
    first_read(database, 2)
    assert database.plans_asked == 1


def test_a_sync_plans_again():
    database = PlannedDatabase()
    first_read(database, 1)
    QueryPlans.forget()
    first_read(database, 1)
    assert database.plans_asked == 2


def read_twice_here(work: RepeatedWork) -> None:
    work.mark_read()
    work.loaded([], Statement(LOOKUP, [1]))
    work.mark_read()
    work.loaded([], Statement(LOOKUP, [1]))


def test_a_repeated_read_finding_still_names_the_origin_file_and_line():
    work = RepeatedWork(PlannedDatabase())
    with pytest.raises(RepeatedCallsError) as raised, work.request():
        read_twice_here(work)
    assert "first read:" in str(raised.value) and "test_query_plans.py" in str(raised.value) and "read_twice_here" in str(raised.value)

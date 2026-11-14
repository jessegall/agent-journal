import pytest

from engine.errors.unscoped_read_error import UnscopedReadError
from engine.model.tables import Tables
from engine.query.errors.query_limit_error import QueryLimitError
from engine.query.query import Query
from engine.row.row_owner import RowOwner
from tests.integration.engine.query.test_query_scoping import Shelf, database  # noqa: F401  (the shared fixture)

ALL_ENVIRONMENTS_REASON = "the test reads the shelves of both environments"


@pytest.fixture
def shelves(database):
    database.unscoped_reads_raise, database.row_owner = True, None
    return Query(database, Tables(), Shelf)


def test_a_read_of_scoped_rows_with_no_environment_set_fails_naming_the_model(shelves):
    with pytest.raises(UnscopedReadError, match="a read of the shelves table has no environment set"):
        shelves.first()


def test_a_read_inside_an_environment_reads_its_rows(shelves):
    shelves.database.row_owner = RowOwner(None, 1)
    assert {shelf.environment_id for shelf in shelves.take(20)} == {1}


def test_a_read_that_names_why_it_crosses_every_environment_reads_them_all(shelves):
    assert {shelf.environment_id for shelf in shelves.every_environment(ALL_ENVIRONMENTS_REASON).take(20)} == {1, 2}


def test_a_skip_of_the_environment_scope_lets_the_read_pass(shelves):
    shelves.database.environment_scope_passed = True
    assert shelves.count() == 60


def test_a_crossing_read_without_a_reason_is_refused(shelves):
    with pytest.raises(QueryLimitError, match="say why the read crosses every environment"):
        shelves.every_environment(" ")

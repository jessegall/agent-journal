from dataclasses import dataclass

import pytest

from engine.database.statement import Statement
from engine.database.table_statements import TableStatements
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.model.tables import Tables
from engine.query.query import Query
from engine.row.row_owner import RowOwner
from tests.unit.engine.model.test_table import LogEntry
from tests.unit.engine.query.test_query import FIXED_TIME, entries  # noqa: F401  (the shared fixture)


@dataclass(frozen=True, kw_only=True)
class Keeper(Model):
    model_name = "agent"
    cli_name = "agent"

    given_name: str


@dataclass(frozen=True, kw_only=True)
class Desk(EnvironmentScoped, Model):
    model_name = "desk"
    cli_name = "desk"

    environment_id: int = 0
    shelf_id: int


def written(query: Query) -> Statement:
    return query.scoped(query.select).statement()


def test_join_writes_join_on(entries: Query[LogEntry]):
    joined = entries.join(Keeper, "agents.id", "=", "log_entries.shelf_id").select_columns("log_entries.*", "agents.given_name")
    assert written(joined) == Statement("SELECT log_entries.*, agents.given_name FROM log_entries JOIN agents ON agents.id = log_entries.shelf_id")


def test_left_join_writes_left_join(entries: Query[LogEntry]):
    assert written(entries.left_join(Keeper, "agents.id", "=", "log_entries.shelf_id")) == Statement(
        "SELECT * FROM log_entries LEFT JOIN agents ON agents.id = log_entries.shelf_id")


def test_a_join_to_an_environment_scoped_model_adds_its_environment_condition(entries: Query[LogEntry]):
    entries.database.row_owner = RowOwner(agent=None, environment_id=5)
    assert written(entries.join(Desk, "desks.shelf_id", "=", "log_entries.shelf_id")) == Statement(
        "SELECT * FROM log_entries JOIN desks ON desks.shelf_id = log_entries.shelf_id WHERE desks.environment_id = ?", [5])


def test_order_by_desc_then_oldest_orders_by_priority_desc_then_id_asc(entries: Query[LogEntry]):
    assert written(entries.order_by("shelf_id", "desc").oldest()) == Statement("SELECT * FROM log_entries ORDER BY shelf_id DESC, id ASC")


def test_newest_oldest_ordered_descending_still_work(entries: Query[LogEntry]):
    assert [row.id for row in entries.newest().limited(3)] == [7, 6, 5]
    assert [row.id for row in entries.oldest().limited(2)] == [1, 2]
    assert [row.id for row in entries.ordered("shelf_id", "id").limited(2)] == [1, 3]
    assert [row.id for row in entries.descending("id").limited(1)] == [7]


def test_page_two_gives_25_rows_and_the_total(entries: Query[LogEntry]):
    table = Tables().table(LogEntry)
    for number in range(50):
        entries.database.insert(TableStatements(table).insert(table.row(LogEntry(title=f"More {number}"), table.columns), FIXED_TIME))
    page = entries.oldest().page(2)
    assert len(page.rows) == 25 and page.rows[0].id == 26 and page.total == 57


def test_group_by_count_by_gives_a_dict_of_counts(entries: Query[LogEntry]):
    assert entries.group_by("shelf_id").count_by() == {None: 4, 3: 3}
    assert entries.where_in("id", []).group_by("shelf_id").count_by() == {}

from unittest.mock import patch

import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from engine.query.conditions.contains_every import ContainsEvery
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.query.select import Select
from core.modules.messages.models.message import Message
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.sequences.models.sequence_run_row import SequenceRunRow
from engine.scope.scopes import Scopes
from engine.database.errors.repeated_calls_error import RepeatedCallsError
from tests.stories.support.story_checks import expect_value

TEST_ROWS_REASON = "the test reads every row it checks"


def test_a_full_table_scan_is_reported_even_when_no_row_is_loaded(new_story):
    story = new_story()
    database = story.container.get(Database)
    with pytest.raises(RepeatedCallsError, match="scanned tasks"):
        with story.repeated_work.request():
            database.rows(Statement("SELECT * FROM tasks WHERE title LIKE '%unindexed%'"))


@pytest.mark.parametrize("statement", [Statement("SELECT * FROM settings"), Statement("SELECT * FROM sequences"), Statement("SELECT * FROM registry")])
def test_a_declared_small_table_may_be_scanned(new_story, statement):
    story = new_story()
    with story.repeated_work.request():
        story.container.get(Database).rows(statement)


def test_a_statement_is_explained_once_per_request(new_story, monkeypatch):
    monkeypatch.setattr("engine.database.repeated_work.READ_LIMIT_REPEATS", 3)
    story = new_story()
    database = story.container.get(Database)
    statement = Statement("SELECT * FROM tasks WHERE id = ?", [0])
    with patch.object(database, "query_plan", return_value=(), create=True) as plan:
        for _ in range(2):
            with story.repeated_work.request():
                for _ in range(3):
                    database.rows(statement)
    expect_value(plan.call_count, 2)


def test_a_covering_index_may_be_scanned_without_reading_the_table(new_story):
    story = new_story()
    with story.repeated_work.request():
        story.container.get(Database).rows(Statement("SELECT id FROM agents WHERE role <> ?", ["main"]))


def test_an_unfiltered_primary_key_page_is_a_bounded_read(new_story):
    story = new_story()
    with story.repeated_work.request():
        story.container.get(Database).rows(Statement("SELECT * FROM agents ORDER BY id DESC LIMIT 25 OFFSET 0"))


def test_an_unfiltered_primary_key_page_can_bind_its_size_and_offset(new_story):
    story = new_story()
    with story.repeated_work.request():
        story.container.get(Database).rows(Statement("SELECT * FROM events ORDER BY id DESC LIMIT ? OFFSET ?", (25, 0)))


def test_a_page_with_an_unindexed_sort_still_reports_the_table_scan(new_story):
    story = new_story()
    with pytest.raises(RepeatedCallsError, match="scanned agents"):
        with story.repeated_work.request():
            story.container.get(Database).rows(Statement("SELECT * FROM agents ORDER BY created_at DESC LIMIT 25 OFFSET 0"))


def test_a_partial_index_scans_only_the_rows_it_indexes(new_story):
    story = new_story()
    with story.repeated_work.request():
        story.container.get(Database).rows(Statement("SELECT * FROM reader_requests WHERE completed_at IS NULL"))


def test_a_user_substring_search_records_why_it_scans(new_story):
    story = new_story()
    statement = Select("tasks").matching(ContainsEvery(["title"], ["cart"])).sliced(25, 0).statement()
    with story.repeated_work.request():
        story.container.get(Database).rows(statement)
    expect_value(story.repeated_work.allowed_scans[statement], statement.scan_reason)


def test_a_recursive_cte_scans_its_working_rows_instead_of_a_stored_table(new_story):
    story = new_story()
    with story.repeated_work.request():
        story.container.get(Database).rows(Statement(
            "WITH RECURSIVE chain(id) AS (VALUES (1) UNION ALL SELECT id + 1 FROM chain WHERE id < 2) SELECT * FROM chain"))


def test_json_each_scans_a_value_instead_of_a_stored_table(new_story):
    story = new_story()
    with story.repeated_work.request():
        story.container.get(Database).rows(Statement("SELECT value FROM json_each(?)", ['["a", "b"]']))


def test_an_empty_id_filter_needs_no_database_read(new_story):
    story = new_story()
    query = story.container.get(Queries).query(Message).matching(Among("id", []))
    with patch.object(story.container.get(Database), "rows", wraps=story.container.get(Database).rows) as rows:
        with story.repeated_work.request():
            expect_value(list(query.every_row(TEST_ROWS_REASON)), [])
            expect_value(query.count(), 0)
            expect_value(query.exists(), False)
    expect_value(rows.call_count, 0)


def test_a_materialized_subquery_is_not_a_stored_table(new_story):
    story = new_story()
    with story.repeated_work.request():
        story.container.get(Database).rows(Statement(
            "SELECT * FROM (SELECT value, row_number() OVER () AS position FROM json_each(?)) AS listed", ['[1, 2]']))


@pytest.mark.parametrize("model", [AgentBlock, SequenceRunRow])
def test_a_required_agent_column_has_no_null_branch(new_story, model):
    story = new_story()
    query = story.container.get(Queries).query(model)
    with story.container.get(Scopes).read_scope((), 1):
        statement = query.scoped(query.select).statement()
        expect_value("OR agent_id IS NULL" in statement.sql, False)
        with story.repeated_work.request():
            list(query.every_row(TEST_ROWS_REASON))


def test_output_list_by_creator_does_not_scan_outputs(new_story):
    story = new_story()
    story.expect_success("output list --creator 1 --limit 15")

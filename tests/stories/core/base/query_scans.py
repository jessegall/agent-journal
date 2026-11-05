from unittest.mock import patch

import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.testing.repeated_calls_error import RepeatedCallsError
from tests.stories.support.story_checks import expect_value


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


def test_a_statement_is_explained_once_per_request(new_story):
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


def test_a_page_with_an_unindexed_sort_still_reports_the_table_scan(new_story):
    story = new_story()
    with pytest.raises(RepeatedCallsError, match="scanned agents"):
        with story.repeated_work.request():
            story.container.get(Database).rows(Statement("SELECT * FROM agents ORDER BY created_at DESC LIMIT 25 OFFSET 0"))


def test_a_partial_index_scans_only_the_rows_it_indexes(new_story):
    story = new_story()
    with story.repeated_work.request():
        story.container.get(Database).rows(Statement("SELECT * FROM reader_requests WHERE completed_at IS NULL"))

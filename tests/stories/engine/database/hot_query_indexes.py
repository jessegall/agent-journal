import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value_with

HOT_QUERIES = ("SELECT * FROM processes WHERE state IN ('running', 'background') ORDER BY id",
               "SELECT * FROM processes WHERE environment_id = 1 ORDER BY id DESC",
               "SELECT * FROM outputs WHERE state = 'kept' AND ended_at > '' ORDER BY ended_at LIMIT 1",
               "SELECT * FROM tasks WHERE delegated_to = 1 AND state = 'open'",
               "SELECT * FROM dock_items WHERE type = 'run' ORDER BY id",
               "SELECT * FROM dock_items WHERE target_model = 'process' AND target_id = 1",
               "SELECT * FROM agent_lines WHERE state = 'waiting' AND source IN ('a', 'b') ORDER BY id")


def query_plan(new_story, query: str) -> str:
    story = new_story(fixture=MainEnvironment)
    return " ".join(str(row[3]) for row in story.container.get(Database).rows(Statement(f"EXPLAIN QUERY PLAN {query}", [])))


@pytest.mark.parametrize("query", HOT_QUERIES)
def test_a_hot_query_uses_an_index(new_story, query):
    plan = query_plan(new_story, query)
    expect_value_with(plan, "USING")
    expect_value_with(plan, "INDEX")


def test_the_oldest_ended_output_is_read_with_no_sort(new_story):
    expect_absent_query_plan(new_story, HOT_QUERIES[2], "TEMP B-TREE")


def expect_absent_query_plan(new_story, query: str, expected) -> None:
    actual = query_plan(new_story, query)
    assert expected not in actual, actual

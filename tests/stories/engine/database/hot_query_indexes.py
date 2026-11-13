import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value_with
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

HOT_QUERIES = ("SELECT * FROM processes WHERE state IN ('running', 'background') ORDER BY id",
               "SELECT * FROM processes WHERE environment_id = 1 ORDER BY id DESC",
               "SELECT * FROM outputs WHERE state = 'kept' AND ended_at > '' ORDER BY ended_at LIMIT 1",
               "SELECT * FROM tasks WHERE state = 'open' AND id IN (SELECT subject_id FROM assignments WHERE subject_model = 'task' AND actor_id IN (1))",
               "SELECT * FROM tasks WHERE state = 'open' AND id NOT IN (SELECT subject_id FROM assignments WHERE subject_model = 'task')",
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


def test_the_open_tasks_assigned_to_an_actor_are_read_through_the_index_on_the_actor(new_story):
    expect_value_with(query_plan(new_story, HOT_QUERIES[3]), "assignments_actor")


FIXED_READS = (f"SELECT * FROM helper_jobs WHERE profile = '{RESEARCHER_PROFILE.name}' AND session_agent_id IN (SELECT id FROM agents WHERE role = 'main') AND ended_at IS NOT NULL"
               " AND helper_id IS NOT NULL ORDER BY id DESC LIMIT 50",
               "SELECT * FROM helper_jobs WHERE ended_at IS NULL AND helper_id = 1 LIMIT 1",
               f"SELECT * FROM helper_jobs WHERE profile = '{RESEARCHER_PROFILE.name}' AND ended_at IS NOT NULL ORDER BY id DESC LIMIT 50",
               "SELECT * FROM aliases WHERE category = 'build' AND id > 0 ORDER BY id LIMIT 50",
               "SELECT * FROM hook_calls WHERE session_agent_id = 1 AND answer = 'refused' AND created_at > '2026-11-12' LIMIT 1",
               "SELECT * FROM agents WHERE parent_id = 1 AND role = 'helper' AND ended_at > '' ORDER BY id LIMIT 50",
               "SELECT * FROM agent_skills WHERE session_agent_id = 1 AND state = 'due' ORDER BY id LIMIT 50")


@pytest.mark.parametrize("query", FIXED_READS)
def test_a_read_moved_off_the_whole_table_uses_an_index(new_story, query):
    plan = query_plan(new_story, query)
    expect_value_with(plan, "USING")
    expect_value_with(plan, "INDEX")

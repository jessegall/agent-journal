from engine.database.statement import Statement
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE
from tests.stories.support.story_checks import expect_value_with
import pytest

HOT_QUERIES = ("SELECT * FROM processes WHERE state IN ('running', 'background') ORDER BY id",
               "SELECT * FROM processes WHERE environment_id = 1 ORDER BY id DESC",
               "SELECT * FROM outputs WHERE state = 'kept' AND ended_at > '' ORDER BY ended_at LIMIT 1",
               "SELECT * FROM tasks WHERE state = 'open' AND id IN (SELECT subject_id FROM assignments WHERE subject_model = 'task' AND actor_id IN (1))",
               "SELECT * FROM tasks WHERE state = 'open' AND id NOT IN (SELECT subject_id FROM assignments WHERE subject_model = 'task')",
               "SELECT * FROM dock_items WHERE type = 'run' ORDER BY id",
               "SELECT * FROM dock_items WHERE target_model = 'process' AND target_id = 1",
               "SELECT * FROM agent_lines WHERE state = 'waiting' AND source IN ('a', 'b') ORDER BY id")
FIXED_READS = (f"SELECT * FROM helper_jobs WHERE profile = '{RESEARCHER_PROFILE.name}' AND session_agent_id IN (SELECT id FROM agents WHERE role = 'main') AND ended_at IS NOT NULL"
               " AND helper_id IS NOT NULL ORDER BY id DESC LIMIT 50",
               "SELECT * FROM helper_jobs WHERE ended_at IS NULL AND helper_id = 1 LIMIT 1",
               f"SELECT * FROM helper_jobs WHERE profile = '{RESEARCHER_PROFILE.name}' AND ended_at IS NOT NULL ORDER BY id DESC LIMIT 50",
               "SELECT * FROM aliases WHERE category = 'build' AND id > 0 ORDER BY id LIMIT 50",
               "SELECT * FROM hook_calls WHERE session_agent_id = 1 AND answer = 'refused' AND created_at > '2026-11-12' LIMIT 1",
               "SELECT * FROM agents WHERE parent_id = 1 AND role = 'helper' AND ended_at > '' ORDER BY id LIMIT 50",
               "SELECT * FROM agent_skills WHERE session_agent_id = 1 AND state = 'due' ORDER BY id LIMIT 50")


def query_plan(journal, query: str) -> str:
    return " ".join(str(row[3]) for row in journal.database.rows(Statement(f"EXPLAIN QUERY PLAN {query}", [])))


def expect_absent_query_plan(journal, query: str, expected) -> None:
    actual = query_plan(journal, query)
    assert expected not in actual, actual


@pytest.mark.parametrize("query", HOT_QUERIES)
def test_a_hot_query_uses_an_index(journal, query):
    plan = query_plan(journal, query)
    expect_value_with(plan, "USING")
    expect_value_with(plan, "INDEX")


def test_the_oldest_ended_output_is_read_with_no_sort(journal):
    expect_absent_query_plan(journal, HOT_QUERIES[2], "TEMP B-TREE")


def test_the_open_tasks_assigned_to_an_actor_are_read_through_the_index_on_the_actor(journal):
    expect_value_with(query_plan(journal, HOT_QUERIES[3]), "assignments_actor")


@pytest.mark.parametrize("query", FIXED_READS)
def test_a_read_moved_off_the_whole_table_uses_an_index(journal, query):
    plan = query_plan(journal, query)
    expect_value_with(plan, "USING")
    expect_value_with(plan, "INDEX")

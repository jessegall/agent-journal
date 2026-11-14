import sqlite3

import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from core.modules.tasks.support.task_match import matches_complexity_range
from suites.coding.modules.workers.models.worker_route import WorkerRoute
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.support.story_checks import expect_absent_value

TASK_ID = 1
INSERT_DECISION = Statement("INSERT INTO assign_decisions (version, created_at, updated_at, task_id, outcome) VALUES (1, 'now', 'now', ?, 'unmatched')", [TASK_ID])


def test_the_assign_rules_module_creates_its_three_tables(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    names = {row["name"] for row in story.container.get(Database).rows(Statement("SELECT name FROM sqlite_master WHERE type = 'table'", []))}
    story.expect_rows({"assign_rules", "assign_rule_conditions", "assign_decisions"} <= names, detail=str(names))


def test_a_task_has_one_decision_which_can_be_updated(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    database = story.container.get(Database)
    database.insert(INSERT_DECISION)
    with pytest.raises(sqlite3.IntegrityError):
        database.insert(INSERT_DECISION)
    story.expect_rows(database.update(Statement("UPDATE assign_decisions SET outcome = 'skipped' WHERE task_id = ?", [TASK_ID])) == 1)



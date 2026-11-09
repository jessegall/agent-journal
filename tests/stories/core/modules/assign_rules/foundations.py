import sqlite3

import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
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


@pytest.mark.parametrize("complexity, minimum, maximum, expected", [(4, 4, None, True), (5, 4, None, True), (3, 4, None, False), (None, 4, None, False), (None, None, 3, False), (None, None, None, True), (2, 2, 2, True)])
def test_a_complexity_range_means_the_same_for_a_rule_and_a_route(complexity, minimum, maximum, expected):
    route = WorkerRoute(creator_id=1, position=1, minimum_complexity=minimum, maximum_complexity=maximum)
    expect_absent_value([answer for answer in (matches_complexity_range(complexity, minimum, maximum), route.matches((), complexity)) if answer is not expected])

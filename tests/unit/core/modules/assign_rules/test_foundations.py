
from core.modules.tasks.support.task_match import matches_complexity_range
from engine.database.statement import Statement
from suites.coding.modules.workers.models.worker_route import WorkerRoute
from tests.stories.support.story_checks import expect_absent_value
import pytest

TASK_ID = 1
INSERT_DECISION = Statement("INSERT INTO assign_decisions (version, created_at, updated_at, task_id, outcome) VALUES (1, 'now', 'now', ?, 'unmatched')", [TASK_ID])


@pytest.mark.parametrize("complexity, minimum, maximum, expected", [(4, 4, None, True), (5, 4, None, True), (3, 4, None, False), (None, 4, None, False), (None, None, 3, False), (None, None, None, True), (2, 2, 2, True)])
def test_a_complexity_range_means_the_same_for_a_rule_and_a_route(complexity, minimum, maximum, expected):
    route = WorkerRoute(creator_id=1, position=1, minimum_complexity=minimum, maximum_complexity=maximum)
    expect_absent_value([answer for answer in (matches_complexity_range(complexity, minimum, maximum), route.matches((), complexity)) if answer is not expected])

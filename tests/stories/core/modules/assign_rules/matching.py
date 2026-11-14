from tests.stories.core.modules.assign_rules.support.rule_steps import recorded_decision, task_assignments
import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from core.modules.assign_rules.models.enums.condition_field import ConditionField
from core.modules.assign_rules.models.enums.condition_operator import ConditionOperator
from core.modules.assign_rules.models.enums.creator_type import CreatorType
from core.modules.assign_rules.models.support.condition_checks import check_condition
from core.modules.assign_rules.models.support.task_facts import TaskFacts
from core.modules.assign_rules.support.task_facts_reader import TaskFactsReader
from core.modules.tasks.models.support.task_priority import TaskPriority
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.support.story_checks import expect_absent_value

TASK_ID = 1
TITLE_HAS_WORD = (ConditionField.TITLE, ConditionOperator.HAS_WORD)


def facts(**values) -> TaskFacts:
    fields = {"title": "", "brief": "", "complexity": None, "priority": TaskPriority("normal"), "tags": (), "creator_type": CreatorType.PERSON, "creator_id": 1, "plan_id": None}
    return TaskFacts(**{**fields, **values})


@pytest.fixture
def rule_story(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.database = story.container.get(Database)
    story.environment_id = story.database.rows(Statement("SELECT environment_id FROM tasks WHERE id = ?", [TASK_ID]))[0]["environment_id"]
    story.creator_id = story.database.rows(Statement("SELECT creator_id FROM tasks WHERE id = ?", [TASK_ID]))[0]["creator_id"]
    return story


def insert_rule(story, position, enabled=1, field=ConditionField.ANY, operator=ConditionOperator.ANY, value=""):
    rule_id = story.database.insert(Statement("INSERT INTO assign_rules (version, created_at, updated_at, environment_id, creator_id, position, enabled, target) VALUES (1, '2026-01-01T00:00:00+00:00', '2026-01-01T00:00:00+00:00', ?, ?, ?, ?, 'main')",
                                              [story.environment_id, story.creator_id, position, enabled]))
    story.database.insert(Statement("INSERT INTO assign_rule_conditions (version, created_at, updated_at, rule_id, field, operator, value) VALUES (1, '2026-01-01T00:00:00+00:00', '2026-01-01T00:00:00+00:00', ?, ?, ?, ?)", [rule_id, field.value, operator.value, value]))
    return rule_id


def decide(story):
    return recorded_decision(story, TASK_ID)


def test_no_rule_leaves_the_task_free_and_says_so(rule_story):
    decision = decide(rule_story)
    rule_story.expect_rows(decision.outcome == "unmatched", decision.rule_id is None, decision.actor_id is None)


def test_a_rule_that_does_not_match_and_a_disabled_rule_are_passed_over(rule_story):
    insert_rule(rule_story, 1, field=ConditionField.TITLE, operator=ConditionOperator.HAS_WORD, value="migration")
    insert_rule(rule_story, 2, enabled=0)
    rule_story.expect_rows(decide(rule_story).outcome == "unmatched")


def test_the_first_matching_rule_by_position_gives_the_task_to_its_target(rule_story):
    insert_rule(rule_story, 2)
    first = insert_rule(rule_story, 1)
    decision = decide(rule_story)
    rule_story.expect_rows(decision.outcome == "assigned", decision.rule_id == first, [given.actor_id for given in task_assignments(rule_story, TASK_ID)] == [rule_story.agent.id])


def test_a_second_judgement_updates_the_one_decision(rule_story):
    decide(rule_story)
    rule = insert_rule(rule_story, 1)
    decision = decide(rule_story)
    count = rule_story.database.rows(Statement("SELECT count(*) AS total FROM assign_decisions WHERE task_id = ?", [TASK_ID]))[0]["total"]
    rule_story.expect_rows(count == 1, decision.rule_id == rule)


def test_the_kind_of_creator_is_read_from_the_actor(rule_story):
    person = rule_story.new_row_id('actor make user "Ada"')
    reader = rule_story.container.get(TaskFactsReader)
    rule_story.expect_rows(reader.creator_type(person) is CreatorType.PERSON, reader.creator_type(rule_story.agent.id) is CreatorType.MAIN_AGENT)

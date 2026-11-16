from core.modules.assign_rules.models.enums.condition_field import ConditionField
from core.modules.assign_rules.models.enums.condition_operator import ConditionOperator
from core.modules.assign_rules.models.enums.creator_type import CreatorType
from core.modules.assign_rules.models.support.condition_checks import check_condition
from core.modules.assign_rules.models.support.task_facts import TaskFacts
from core.modules.tasks.models.support.task_priority import TaskPriority
from engine.database.statement import Statement
from tests.stories.core.modules.assign_rules.support.rule_steps import recorded_decision
from tests.stories.support.story_checks import expect_absent_value
import pytest

TASK_ID = 1
TITLE_HAS_WORD = (ConditionField.TITLE, ConditionOperator.HAS_WORD)


def facts(**values) -> TaskFacts:
    fields = {"title": "", "brief": "", "complexity": None, "priority": TaskPriority("normal"), "tags": (), "creator_type": CreatorType.PERSON, "creator_id": 1, "plan_id": None}
    return TaskFacts(**{**fields, **values})


def insert_rule(story, position, enabled=1, field=ConditionField.ANY, operator=ConditionOperator.ANY, value=""):
    rule_id = story.database.insert(Statement("INSERT INTO assign_rules (version, created_at, updated_at, environment_id, creator_id, position, enabled, target) VALUES (1, '2026-01-01T00:00:00+00:00', '2026-01-01T00:00:00+00:00', ?, ?, ?, ?, 'main')",
                                              [story.environment_id, story.creator_id, position, enabled]))
    story.database.insert(Statement("INSERT INTO assign_rule_conditions (version, created_at, updated_at, rule_id, field, operator, value) VALUES (1, '2026-01-01T00:00:00+00:00', '2026-01-01T00:00:00+00:00', ?, ?, ?, ?)", [rule_id, field.value, operator.value, value]))
    return rule_id


def decide(story):
    return recorded_decision(story, TASK_ID)


@pytest.mark.parametrize("field, operator, value, given, expected", [
    (ConditionField.COMPLEXITY, ConditionOperator.MINIMUM, "4", {}, False),
    (ConditionField.COMPLEXITY, ConditionOperator.UNSET, "", {}, True),
    (ConditionField.COMPLEXITY, ConditionOperator.IS_SET, "", {}, False),
    (ConditionField.COMPLEXITY, ConditionOperator.MINIMUM, "4", {"complexity": 4}, True),
    (ConditionField.COMPLEXITY, ConditionOperator.MINIMUM, "4", {"complexity": 3}, False),
    (ConditionField.COMPLEXITY, ConditionOperator.MAXIMUM, "5", {"complexity": 5}, True),
    (ConditionField.COMPLEXITY, ConditionOperator.EQUALS, "3", {"complexity": 3}, True),
    (*TITLE_HAS_WORD, "migration", {"title": "Fix migration of users"}, True),
    (*TITLE_HAS_WORD, "migration", {"title": "Fix migrations"}, False),
    (*TITLE_HAS_WORD, "migration", {"title": "Migration, again"}, True),
    (*TITLE_HAS_WORD, "migration", {"title": "A MIGRATION now"}, True),
    (*TITLE_HAS_WORD, "pre-migration", {"title": "A pre-migration step"}, True),
    (*TITLE_HAS_WORD, "migration", {"title": "A pre-migration step"}, False),
    (*TITLE_HAS_WORD, "data model", {"title": "Change the data model"}, True),
    (*TITLE_HAS_WORD, "data model", {"title": "The model of data"}, False),
    (*TITLE_HAS_WORD, "migration", {"brief": "the migration"}, False),
    (ConditionField.BRIEF, ConditionOperator.HAS_WORD, "migration", {"brief": "the migration"}, True),
    (ConditionField.TEXT, ConditionOperator.HAS_WORD, "migration", {"brief": "the migration"}, True),
    (ConditionField.TEXT, ConditionOperator.HAS_WORD, "migration", {"title": "A migration"}, True),
    (ConditionField.TEXT, ConditionOperator.LACKS_WORD, "migration", {"title": "A migration"}, False),
    (ConditionField.TAG, ConditionOperator.HAS, "backend", {"tags": ("backend",)}, True),
    (ConditionField.TAG, ConditionOperator.HAS, "backend", {}, False),
    (ConditionField.TAG, ConditionOperator.LACKS, "backend", {}, True),
    (ConditionField.PRIORITY, ConditionOperator.MINIMUM, "high", {"priority": TaskPriority("critical")}, True),
    (ConditionField.PRIORITY, ConditionOperator.MINIMUM, "high", {"priority": TaskPriority("high")}, True),
    (ConditionField.PRIORITY, ConditionOperator.MINIMUM, "high", {"priority": TaskPriority("normal")}, False),
    (ConditionField.PRIORITY, ConditionOperator.EQUALS, "high", {"priority": TaskPriority("high")}, True),
    (ConditionField.CREATOR, ConditionOperator.IS_PERSON, "", {}, True),
    (ConditionField.CREATOR, ConditionOperator.IS_PERSON, "", {"creator_type": CreatorType.HELPER}, False),
    (ConditionField.CREATOR, ConditionOperator.IS_PERSON, "", {"creator_type": CreatorType.MAIN_AGENT}, False),
    (ConditionField.CREATOR, ConditionOperator.IS_MAIN_AGENT, "", {"creator_type": CreatorType.MAIN_AGENT}, True),
    (ConditionField.CREATOR, ConditionOperator.IS_HELPER, "", {"creator_type": CreatorType.HELPER}, True),
    (ConditionField.CREATOR, ConditionOperator.IS_AGENT, "7", {"creator_id": 7}, True),
    (ConditionField.PLACE, ConditionOperator.UNPLANNED, "", {}, True),
    (ConditionField.PLACE, ConditionOperator.UNPLANNED, "", {"plan_id": 3}, False),
    (ConditionField.PLACE, ConditionOperator.PLANNED, "3", {"plan_id": 3}, True),
    (ConditionField.ANY, ConditionOperator.ANY, "", {}, True),
])
def test_a_condition_matches_the_facts_of_a_task(field, operator, value, given, expected):
    expect_absent_value([] if check_condition(field, operator, value, facts(**given)) is expected else [(field, operator, value, given)])

import pytest

from engine.actor.actor import Actor
from engine.command.bus import Bus
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.modules.assign_rules.commands.record_assign_decision.record_assign_decision import RecordAssignDecision
from core.modules.assign_rules.models.enums.condition_field import ConditionField
from core.modules.assign_rules.models.enums.condition_operator import ConditionOperator
from core.modules.assign_rules.models.enums.creator_type import CreatorType
from core.modules.assign_rules.models.enums.decision_outcome import DecisionOutcome
from core.modules.assign_rules.models.support.condition_checks import check_condition
from core.modules.assign_rules.models.support.task_facts import TaskFacts
from core.modules.assign_rules.support.task_facts_reader import TaskFactsReader
from engine.query.queries import Queries
from core.modules.tasks.models.support.task_priority import TaskPriority
from core.modules.tasks.models.task import Task
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.support.story_checks import expect_absent_value

TASK_ID = 1
TITLE_HAS_WORD = (ConditionField.TITLE, ConditionOperator.HAS_WORD)


def facts(**values) -> TaskFacts:
    fields = {"title": "", "brief": "", "complexity": None, "priority": TaskPriority("normal"), "tags": (), "creator_type": CreatorType.PERSON, "creator_id": 1, "plan_id": None}
    return TaskFacts(**{**fields, **values})


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
    (ConditionField.TAG, ConditionOperator.HAS, "backend", {"tags": tuple(["backend"])}, True),
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
    return story.container.get(Bus).run(RecordAssignDecision(TASK_ID), Actor.core(), environment_id=story.environment_id)


def test_no_rule_leaves_the_task_free_and_says_so(rule_story):
    decision = decide(rule_story)
    rule_story.expect_rows(decision.outcome is DecisionOutcome.UNMATCHED, decision.rule_id is None, decision.actor_id is None)


def test_a_rule_that_does_not_match_is_passed_over(rule_story):
    insert_rule(rule_story, 1, field=ConditionField.TITLE, operator=ConditionOperator.HAS_WORD, value="migration")
    rule_story.expect_rows(decide(rule_story).outcome is DecisionOutcome.UNMATCHED)


def test_the_first_matching_rule_by_position_is_recorded_and_nothing_is_assigned(rule_story):
    insert_rule(rule_story, 2)
    first = insert_rule(rule_story, 1)
    decision = decide(rule_story)
    task = rule_story.container.get(Queries).query(Task).find(TASK_ID)
    rule_story.expect_rows(decision.outcome is DecisionOutcome.DRY_RUN, decision.rule_id == first, task.delegated_to is None)


def test_a_disabled_rule_is_not_used(rule_story):
    insert_rule(rule_story, 1, enabled=0)
    rule_story.expect_rows(decide(rule_story).outcome is DecisionOutcome.UNMATCHED)


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

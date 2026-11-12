import json

import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from tests.stories.core.modules.assignments.support.assignment_reads import assignment_of, assignment_rows, row_actors
from tests.stories.core.modules.plans.support.assigned_plans import (HAND_GIVEN_TASK, OLD_ASSIGNEE_PATH, PlanWithOldAssignee, plan_worker,
                                                                    run_plan_assignments_migration)

GONE_ACTOR_ID = 999_999


@pytest.fixture
def old_plan(new_story):
    return new_story(fixture=PlanWithOldAssignee)


def old_key(story) -> object:
    return story.container.get(Database).rows(Statement(f"SELECT json_extract(metadata, '{OLD_ASSIGNEE_PATH}') AS assignee FROM plans WHERE id = 1"))[0]["assignee"]


def test_the_assignment_the_old_plan_metadata_held_is_in_the_pivot_and_the_key_is_removed(old_plan):
    run_plan_assignments_migration(old_plan)
    old_plan.expect_success("plan show 1 --environment main", actor=old_plan.user)
    plan_row = assignment_of(old_plan, "plan", 1)
    old_plan.expect_rows(plan_row["actor_id"] == plan_worker(old_plan, 1).id, plan_row["source_id"] is None, old_key(old_plan) is None, detail=str(plan_row))


def test_phases_and_tasks_of_an_assigned_plan_are_marked_inherited_only_where_their_actor_equals_the_plans(old_plan):
    run_plan_assignments_migration(old_plan)
    old_plan.expect_success("phase show 1 --environment main", actor=old_plan.user)
    plan_row, phase_row = assignment_of(old_plan, "plan", 1), assignment_of(old_plan, "phase", 1)
    inherited, by_hand = assignment_of(old_plan, "task", 1), assignment_of(old_plan, "task", HAND_GIVEN_TASK)
    old_plan.expect_rows(phase_row["source_id"] == plan_row["id"], inherited["source_id"] == phase_row["id"], by_hand["source_id"] is None,
                         by_hand["actor_id"] == plan_worker(old_plan, 2).id, detail=str([phase_row, inherited, by_hand]))


def test_plan_inspect_shows_the_same_assignee_after_the_upgrade_as_before(old_plan):
    run_plan_assignments_migration(old_plan)
    inspected = json.loads(old_plan.run("plan inspect 1 --json", actor=old_plan.agent).output_text)
    old_plan.expect_rows(inspected["assignee"] is not None and inspected["assignee"]["id"] == plan_worker(old_plan, 1).id, detail=str(inspected["assignee"]))


def test_a_plan_assigned_to_a_gone_actor_is_dropped_and_counted_in_the_report(old_plan):
    old_plan.container.get(Database).update(Statement(f"UPDATE plans SET metadata = json_set(metadata, '{OLD_ASSIGNEE_PATH}', {GONE_ACTOR_ID}) WHERE id = 1"))
    run_plan_assignments_migration(old_plan)
    old_plan.expect_success("plan board --json --environment main", actor=old_plan.user)
    old_plan.expect_rows(row_actors(old_plan, "plan") == {}, row_actors(old_plan, "phase") == {}, old_key(old_plan) is None, detail=str(row_actors(old_plan, "plan")))


def test_running_the_plans_migration_twice_adds_no_row(old_plan):
    run_plan_assignments_migration(old_plan)
    old_plan.expect_text("task info 1 --environment main", f"assigned to: agent {plan_worker(old_plan, 1).id}", actor=old_plan.user)
    rows = assignment_rows(old_plan)
    run_plan_assignments_migration(old_plan)
    old_plan.expect_rows(assignment_rows(old_plan) == rows, detail=str(rows))

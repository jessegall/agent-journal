import pytest

from tests.stories.core.modules.tasks.support.assignment_migration_fixtures import DELEGATED_TASKS, MISSING_ACTOR_TASK, TasksWithOldAssignments, run_task_assignments_migration, worker
from tests.stories.core.modules.tasks.support.holder_assignee_check import assert_holders_are_assignees, assert_pivot_equals_column, task_assignees

HELD_UNDELEGATED_TASK = 3
UNASSIGNED_TASK = 5


@pytest.fixture
def upgraded(new_story):
    story = new_story(fixture=TasksWithOldAssignments)
    run_task_assignments_migration(story)
    return story


def test_every_task_with_delegated_to_has_the_same_assignee_in_the_pivot(upgraded):
    assignees = task_assignees(upgraded)
    upgraded.expect_rows(all(assignees.get(task_id) == [worker(upgraded).id] for task_id in DELEGATED_TASKS), detail=str(assignees))
    upgraded.expect_text("task info 1", "delegated to:", actor=upgraded.agent)


def test_a_row_pointing_at_a_gone_actor_is_dropped_and_the_others_are_copied(upgraded):
    assignees = task_assignees(upgraded)
    upgraded.expect_rows(MISSING_ACTOR_TASK not in assignees, sorted(assignees) == list(DELEGATED_TASKS), detail=str(assignees))


def test_the_migration_assigns_nothing_because_a_task_is_held(upgraded):
    upgraded.expect_text(f"task show {HELD_UNDELEGATED_TASK}", "state: started", actor=upgraded.agent)
    upgraded.expect_rows(HELD_UNDELEGATED_TASK not in task_assignees(upgraded), detail=str(task_assignees(upgraded)))


def test_no_listener_assigns_a_task_because_it_holds_it(new_story):
    story = new_story(fixture=TasksWithOldAssignments)
    story.expect_success(f"task start {UNASSIGNED_TASK}", actor=worker(story))
    assert_pivot_equals_column(story)
    story.expect_rows(task_assignees(story).get(UNASSIGNED_TASK) == [worker(story).id], detail=str(task_assignees(story)))


def test_a_task_whose_worker_holder_and_assignee_were_the_same_still_is(new_story):
    story = new_story(fixture=TasksWithOldAssignments)
    assert_holders_are_assignees(story)
    story.expect_rows(task_assignees(story).get(2) == [worker(story).id], task_assignees(story).get(HELD_UNDELEGATED_TASK) == [worker(story).id], detail=str(task_assignees(story)))


def test_running_the_migration_twice_adds_no_row(upgraded):
    assignees = task_assignees(upgraded)
    run_task_assignments_migration(upgraded)
    upgraded.expect_rows(task_assignees(upgraded) == assignees, detail=str(task_assignees(upgraded)))

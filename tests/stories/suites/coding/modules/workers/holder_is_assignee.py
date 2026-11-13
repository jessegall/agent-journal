from core.modules.tasks.models.task import Task
from tests.stories.core.modules.tasks.support.holder_assignee_check import assert_holders_are_assignees, assignee_of, task_assignees
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.holder_fixtures import UpgradedTasks, worker_on_first_task, worker_on_two_tasks

BLOCKED_UNASSIGNED_TASK = 3


def expect_assignee(story, task_id: int, actor_id: int) -> None:
    story.expect_text(f"task info {task_id}", f"assigned to: agent {actor_id}", actor=story.agent)
    story.expect_rows(task_assignees(story).get(task_id) == [actor_id], detail=str(task_assignees(story)))


def test_a_task_a_worker_holds_shows_the_worker_in_the_window_task_info_and_task_list(new_story):
    story = worker_on_two_tasks(new_story)
    worker = story.worker
    story.expect_success("task test 1", actor=worker)
    assert_holders_are_assignees(story)
    expect_assignee(story, 1, worker.id)
    story.expect_text("task list --state testing --columns id,holder_id", f"{worker.id}", actor=story.agent)
    story.expect_success("task retest 1", actor=worker)
    story.expect_success('task block 1 --reason "the build tool is missing"', actor=worker)
    assert_holders_are_assignees(story)
    expect_assignee(story, 1, worker.id)
    story.expect_text("task list --state blocked --columns id,holder_id", f"{worker.id}", actor=story.agent)


def test_the_main_agent_parks_a_task_then_moves_it_to_worker_734_and_it_never_shows_the_main_agent(new_story):
    story = worker_on_first_task(new_story)
    worker = story.worker
    story.expect_success("task start 2", actor=story.agent)
    assert_holders_are_assignees(story)
    story.expect_success(f"task assign 2 --to {agent_number(story, worker.id)}", actor=story.agent)
    assert_holders_are_assignees(story)
    expect_assignee(story, 2, worker.id)
    story.expect_text("task show 2", "state: open", "reason: assigned to worker", actor=story.agent)
    story.expect_success("task start 2", actor=worker)
    assert_holders_are_assignees(story)


def test_assigning_a_blocked_task_held_by_x_to_y_clears_the_hold_and_the_task_stays_blocked_and_shows_y(new_story):
    story = worker_on_first_task(new_story)
    worker = story.worker
    story.expect_success("task start 2", actor=story.agent)
    story.expect_success('task block 2 --reason "waits for the price list"', actor=story.agent)
    story.expect_success(f"task assign 2 --to {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_rows(assignee_of(story, story.row(Task, 2)) == worker.id)
    story.expect_text("task show 2", "state: blocked", actor=story.agent)
    story.expect_absent("task show 2", f"holder_id: {story.agent.id}", actor=story.agent)
    story.expect_success("task unblock 2", actor=worker)


def test_no_listener_or_backfill_assigns_a_task_because_it_holds_it(new_story):
    story = new_story(fixture=UpgradedTasks)
    story.run_listeners()
    story.expect_text(f"task show {BLOCKED_UNASSIGNED_TASK}", "state: started", actor=story.agent)
    story.expect_rows(BLOCKED_UNASSIGNED_TASK not in task_assignees(story), detail=str(task_assignees(story)))


def test_path_1_a_blocked_task_cannot_be_assigned_away_while_the_old_holder_stays(new_story):
    story = worker_on_two_tasks(new_story)
    worker = story.worker
    story.expect_success('task block 1 --reason "the database is down"', actor=worker)
    story.expect_success(f"task assign 1 --to {agent_number(story, story.agent.id)}", actor=story.agent)
    story.expect_rows(assignee_of(story, story.row(Task, 1)) == story.agent.id, story.row(Task, 1).holder_id is None)
    story.expect_success("task unblock 1", actor=story.agent)
    story.expect_success("task start 1", actor=story.agent)
    assert_holders_are_assignees(story)


def test_path_2_an_agent_cannot_start_a_task_queued_for_another_worker(new_story):
    story = worker_on_two_tasks(new_story)
    worker = story.worker
    story.expect_refusal("task start 2", f"task 2 is assigned to worker {agent_number(story, worker.id)}", actor=story.agent)
    assert_holders_are_assignees(story)
    expect_assignee(story, 2, worker.id)


def test_path_3_a_migration_never_assigns_by_holder_id(new_story):
    story = new_story(fixture=UpgradedTasks)
    story.expect_rows(BLOCKED_UNASSIGNED_TASK not in task_assignees(story), detail=str(task_assignees(story)))
    story.expect_text(f"task show {BLOCKED_UNASSIGNED_TASK}", "state: started", actor=story.agent)

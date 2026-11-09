import json

import pytest

from core.base.actor import Actor
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker
from tests.stories.suites.coding.modules.workers.support.phase_steps import planned_story
from tests.stories.support.story_checks import expect_value

PLAN_TASKS = (1, 2, 3, 4)
BLOCKED_BUILD_TASK = 2
SHIP_TASK = 4
LONG_PLAN_EXTRA_TASKS = 12


def story_with_two_workers(new_story):
    story = planned_story(new_story)
    first_job = story.new_row_id('task make "First worker job" --environment main', actor=story.agent)
    second_job = story.new_row_id('task make "Second worker job" --environment main', actor=story.agent)
    first = dispatched_worker(story, f"worker dispatch --test-command python=pytest --model sonnet {first_job}")
    second = dispatched_worker(story, f"worker dispatch --test-command python=pytest --model sonnet --fresh \"a second worker\" {second_job}")
    return story, first, second


def expect_task_holder(story, worker: Actor | None) -> None:
    for task in PLAN_TASKS:
        if worker is None:
            story.expect_absent(f"task show {task}", "delegated_to", actor=story.agent)
        else:
            story.expect_text(f"task show {task}", f"delegated_to: {worker.id}", "state: open", actor=story.agent)


def assignee(story) -> dict[str, object]:
    return json.loads(story.run("plan inspect 1 --json", actor=story.agent).output_text)["assignee"]


def test_a_plan_is_assigned_to_a_worker_before_it_starts(new_story):
    story, first, _ = story_with_two_workers(new_story)
    story.expect_success(f"plan assign 1 --to {first.id}", actor=story.agent)
    expect_task_holder(story, first)
    story.expect_text("plan show 1", "state: approved", actor=story.agent)
    expect_value(assignee(story)["id"], first.id)


def test_changing_the_assignee_moves_the_open_tasks_to_the_new_one(new_story):
    story, first, second = story_with_two_workers(new_story)
    story.expect_success(f"plan assign 1 --to {first.id}", actor=story.agent)
    story.expect_success(f"plan assign 1 --to {second.id}", actor=story.agent)
    expect_task_holder(story, second)
    expect_value(assignee(story)["id"], second.id)


def test_letting_the_agent_pick_gives_the_plan_to_the_main_agent(new_story):
    story, first, _ = story_with_two_workers(new_story)
    story.expect_success(f"plan assign 1 --to {first.id}", actor=story.agent)
    story.expect_success("plan assign 1", actor=story.agent)
    expect_task_holder(story, None)
    expect_value(assignee(story), {"id": story.agent.id, "name": "main", "main": True})


def test_an_assigned_plan_keeps_its_worker_when_it_starts(new_story):
    story, first, _ = story_with_two_workers(new_story)
    story.expect_success(f"plan assign 1 --to {first.id}", actor=story.agent)
    story.expect_success("plan start 1", actor=story.user)
    story.expect_text("plan show 1", "state: started", actor=story.agent)
    expect_task_holder(story, first)
    expect_value(assignee(story)["id"], first.id)


def test_a_worker_cannot_assign_a_plan(new_story):
    story, first, second = story_with_two_workers(new_story)
    story.expect_refusal(f"plan assign 1 --to {second.id}", "cannot assign a plan", actor=first)
    expect_task_holder(story, None)


def block_task(story, task: int) -> None:
    story.expect_success(f'task block {task} --reason "waits on the supplier"', actor=story.agent)


def expect_blocked_with(story, task: int, agent: Actor) -> None:
    story.expect_text(f"task show {task}", f"delegated_to: {agent.id}", "state: blocked", actor=story.agent)


@pytest.mark.parametrize("taker", ["worker", "main agent"])
def test_a_blocked_task_moves_with_the_plan_to_the_agent_named(new_story, taker):
    story, first, _ = story_with_two_workers(new_story)
    agent = first if taker == "worker" else story.agent
    block_task(story, BLOCKED_BUILD_TASK)
    story.expect_success(f"plan assign 1 --to {agent.id}", actor=story.user)
    expect_blocked_with(story, BLOCKED_BUILD_TASK, agent)


def test_changing_the_assignee_takes_the_blocked_tasks_from_the_old_worker(new_story):
    story, first, second = story_with_two_workers(new_story)
    block_task(story, BLOCKED_BUILD_TASK)
    story.expect_success(f"plan assign 1 --to {first.id}", actor=story.user)
    story.expect_success(f"plan assign 1 --to {second.id}", actor=story.user)
    expect_blocked_with(story, BLOCKED_BUILD_TASK, second)


def test_a_phase_moves_only_its_own_blocked_tasks(new_story):
    story, first, _ = story_with_two_workers(new_story)
    block_task(story, BLOCKED_BUILD_TASK)
    block_task(story, SHIP_TASK)
    story.expect_success(f"plan assign 1 --phase 2 --to {first.id}", actor=story.user)
    expect_blocked_with(story, SHIP_TASK, first)
    story.expect_absent(f"task show {BLOCKED_BUILD_TASK}", "delegated_to", actor=story.agent)


def test_a_blocked_task_that_opens_later_is_with_the_new_agent(new_story):
    story, first, _ = story_with_two_workers(new_story)
    block_task(story, BLOCKED_BUILD_TASK)
    story.expect_success(f"plan assign 1 --to {first.id}", actor=story.user)
    story.expect_success(f"task unblock {BLOCKED_BUILD_TASK}", actor=story.agent)
    story.expect_text(f"task show {BLOCKED_BUILD_TASK}", f"delegated_to: {first.id}", "state: open", actor=story.agent)


def test_a_started_task_stays_with_its_agent(new_story):
    story, first, _ = story_with_two_workers(new_story)
    story.expect_success(f"task start {BLOCKED_BUILD_TASK}", actor=story.agent)
    story.expect_success(f"plan assign 1 --to {first.id}", actor=story.user)
    story.expect_text(f"task show {BLOCKED_BUILD_TASK}", f"holder_id: {story.agent.id}", "state: started", actor=story.agent)
    story.expect_absent(f"task show {BLOCKED_BUILD_TASK}", f"delegated_to: {first.id}", actor=story.agent)


def test_a_long_plan_is_assigned_with_each_task_read_once(new_story):
    story = planned_story(new_story)
    previous_task = SHIP_TASK
    for number in range(LONG_PLAN_EXTRA_TASKS):
        task = story.new_row_id(f'task make "Extra {number}" --phase 2 --environment main', actor=story.user)
        story.expect_success(f"task depend {task} --on {previous_task}", actor=story.user)
        previous_task = task
    story.expect_success(f"plan assign 1 --to {story.agent.id}", actor=story.user)
    expect_blocked_with(story, previous_task, story.agent)


def test_assigning_no_agent_frees_the_blocked_tasks(new_story):
    story, first, _ = story_with_two_workers(new_story)
    block_task(story, BLOCKED_BUILD_TASK)
    story.expect_success(f"plan assign 1 --to {first.id}", actor=story.user)
    story.expect_success("plan assign 1", actor=story.user)
    story.expect_text(f"task show {BLOCKED_BUILD_TASK}", "state: blocked", actor=story.agent)
    story.expect_absent(f"task show {BLOCKED_BUILD_TASK}", "delegated_to", actor=story.agent)

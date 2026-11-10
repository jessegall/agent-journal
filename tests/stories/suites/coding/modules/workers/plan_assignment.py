import json

import pytest

from engine.actor.actor import Actor
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

import json

from core.base.actor import Actor
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker
from tests.stories.suites.coding.modules.workers.support.phase_steps import planned_story
from tests.stories.support.story_checks import expect_value

PLAN_TASKS = (1, 2, 3, 4)


def story_with_two_workers(new_story):
    story = planned_story(new_story)
    first_job = story.new_row_id('task make "First worker job" --environment main', actor=story.agent)
    second_job = story.new_row_id('task make "Second worker job" --environment main', actor=story.agent)
    first = dispatched_worker(story, f"worker dispatch --model sonnet {first_job}")
    second = dispatched_worker(story, f"worker dispatch --model sonnet --fresh \"a second worker\" {second_job}")
    return story, first, second


def expect_held_by(story, worker: Actor | None) -> None:
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
    expect_held_by(story, first)
    story.expect_text("plan show 1", "state: approved", actor=story.agent)
    expect_value(assignee(story)["id"], first.id)


def test_changing_the_assignee_moves_the_open_tasks_to_the_new_one(new_story):
    story, first, second = story_with_two_workers(new_story)
    story.expect_success(f"plan assign 1 --to {first.id}", actor=story.agent)
    story.expect_success(f"plan assign 1 --to {second.id}", actor=story.agent)
    expect_held_by(story, second)
    expect_value(assignee(story)["id"], second.id)


def test_letting_the_agent_pick_gives_the_plan_to_the_main_agent(new_story):
    story, first, _ = story_with_two_workers(new_story)
    story.expect_success(f"plan assign 1 --to {first.id}", actor=story.agent)
    story.expect_success("plan assign 1", actor=story.agent)
    expect_held_by(story, None)
    expect_value(assignee(story), {"id": story.agent.id, "name": "main", "is_main": True})


def test_an_assigned_plan_keeps_its_worker_when_it_starts(new_story):
    story, first, _ = story_with_two_workers(new_story)
    story.expect_success(f"plan assign 1 --to {first.id}", actor=story.agent)
    story.expect_success("plan start 1", actor=story.user)
    story.expect_text("plan show 1", "state: started", actor=story.agent)
    expect_held_by(story, first)
    expect_value(assignee(story)["id"], first.id)


def test_a_worker_cannot_assign_a_plan(new_story):
    story, first, second = story_with_two_workers(new_story)
    story.expect_refusal(f"plan assign 1 --to {second.id}", "cannot assign a plan", actor=first)
    expect_held_by(story, None)

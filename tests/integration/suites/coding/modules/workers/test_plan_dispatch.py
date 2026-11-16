from tests.stories.suites.coding.modules.workers.plan_dispatch import expect_agents
from tests.stories.suites.coding.modules.workers.plan_dispatch import expect_queued
from tests.stories.suites.coding.modules.workers.support.recorded_test_launches import recorded_test_launches
import json

from tests.stories.core.support.agent_labels import agent_number
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.chat.models.chat_mark import ChatMark
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from tests.stories.core.modules.chat.support.mark_samples import expect_absent_marks_text, expect_marks_text
from tests.stories.suites.coding.modules.workers.support.phase_steps import planned_story


def read_outline(story) -> dict:
    return json.loads(story.run("plan outline 1 --json", actor=story.agent).output_text)


def test_a_dispatch_for_a_phase_hands_the_worker_that_phases_open_tasks_in_plan_order(played):
    story = planned_story(played)
    recorded_test_launches(story)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet --plan 1 --phase 1", actor=story.agent), ActorType.AGENT)
    expect_agents(read_outline(story), (True, [(1, True), (2, True), (3, True)]))
    board = json.loads(story.run("plan board --environment main --json", actor=story.agent).output_text)["plans"][0]
    expect_agents(board, (True, [(1, True), (2, True), (3, True)]))
    expect_queued(read_outline(story), 2, worker.id)
    story.expect_text("task show 4", "state: open", actor=story.agent)
    story.expect_text("task info 2", f"assigned to: agent {worker.id}", actor=story.agent)


def test_a_dispatch_for_a_whole_plan_hands_the_worker_every_open_task_phase_by_phase(played):
    story = planned_story(played)
    recorded_test_launches(story)
    story.run("worker dispatch --test-command python=pytest --model sonnet --plan 1", actor=story.agent)
    expect_agents(read_outline(story), (True, [(1, True), (2, True), (3, True), (4, True)]))


def test_a_dispatch_for_a_phase_shows_a_mark_that_the_plan_was_handed_over(played):
    story = planned_story(played)
    recorded_test_launches(story)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet --plan 1 --phase 1", actor=story.agent), ActorType.AGENT)
    story.run_listeners()
    expect_marks_text(story, f"Worker {agent_number(story, worker.id)} was given 3 tasks")
    marks = tuple(story.story_rows(ChatMark, variant=WorkerMarkVariant.ASSIGNED))
    story.expect_rows(len(marks) == 1, marks[0].target_id == worker.id,
                      all(text in marks[0].detail for text in ("Task 1: Fix the cart", "Task 2: Tax", "Task 3: Totals")))


def test_a_dispatch_for_one_task_shows_no_plan_handed_over(played):
    story = planned_story(played)
    recorded_test_launches(story)
    story.run("worker dispatch --test-command python=pytest --model sonnet 1", actor=story.agent)
    story.run_listeners()
    expect_absent_marks_text(story, "was handed plan")

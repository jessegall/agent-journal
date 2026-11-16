from dataclasses import dataclass

import pytest

from engine.actor.actor import Actor
from engine.testing.stories.story import Story
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, dispatched_worker, repository_environment

SECOND_DISPATCH = DISPATCH[:-1] + "2"


@dataclass
class TwoWorkers:
    """Worker A works on task 1 and worker B on task 2."""

    story: Story
    first: Actor
    second: Actor


@pytest.fixture
def two_workers(new_story) -> TwoWorkers:
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.expect_success('task make "A second task" --brief "Do the second task"', actor=story.agent)
    return TwoWorkers(story, dispatched_worker(story), dispatched_worker(story, SECOND_DISPATCH))


def test_a_task_a_worker_holds_is_not_dispatched_to_another_worker(two_workers):
    story = two_workers.story
    story.expect_refusal(DISPATCH, f"task 1 is held by worker {two_workers.first.id}", actor=story.agent)


def test_a_task_a_worker_holds_is_not_sent_to_another_worker(two_workers):
    story = two_workers.story
    story.expect_refusal(f"worker send {two_workers.second.id} --task 1", f"task 1 is held by worker {two_workers.first.id}", actor=story.agent)


def test_a_task_queued_for_a_worker_is_sent_to_that_worker_again(two_workers):
    story = two_workers.story
    third = story.new_row_id('task make "A third task" --brief "Do the third task"', actor=story.agent)
    story.expect_success(f"worker send --wait {two_workers.first.id} --task {third}", actor=story.agent)
    story.expect_success(f"worker send --wait {two_workers.first.id} --task {third}", actor=story.agent)
    story.expect_text(f"task info {third}", f"assigned to: agent {two_workers.first.id}", actor=story.agent)


def test_the_main_agent_takes_a_started_task_from_its_holder_and_gives_it_to_another_worker_in_one_command(two_workers):
    story = two_workers.story
    story.expect_refusal(f"worker send {two_workers.second.id} --task 1 --take", "only the main agent takes a task", actor=two_workers.first)
    story.expect_success(f"worker send --wait {two_workers.second.id} --task 1 --take", actor=story.agent)
    story.expect_text("task info 1", f"assigned to: agent {two_workers.second.id}", actor=story.agent)

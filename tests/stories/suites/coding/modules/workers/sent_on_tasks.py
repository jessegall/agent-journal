import pytest

from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment


@pytest.fixture
def story_with_repository(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    return story


def test_a_task_the_main_agent_holds_goes_to_the_worker_it_is_dispatched_to(story_with_repository):
    story = story_with_repository
    story.expect_success("task start 1", actor=story.agent)
    worker = dispatched_worker(story)
    story.expect_text("task show 1", f"holder_id: {worker.id}", f"delegated_to: {worker.id}")


def test_a_task_the_main_agent_holds_is_queued_for_the_worker_it_is_sent_to(story_with_repository):
    story = story_with_repository
    worker = dispatched_worker(story)
    task_id = story.new_row_id('task make "A second task" --brief "Do the second task"', actor=story.agent)
    story.expect_success(f"task start {task_id}", actor=story.agent)
    story.expect_success(f"worker send --wait {worker.id} --task {task_id}", actor=story.agent)
    story.expect_text(f"task show {task_id}", f"delegated_to: {worker.id}", "state: open")

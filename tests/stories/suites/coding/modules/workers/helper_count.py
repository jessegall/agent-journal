from tests.stories.suites.coding.modules.workers.support.recorded_test_launches import recorded_test_launches
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.integration.suites.coding.modules.workers.test_test_queue import recording_launch


def test_a_worker_between_runs_with_work_left_counts_as_a_helper(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    recorded_test_launches(story)
    repository_environment(story)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1", actor=story.agent), ActorType.AGENT)
    story.expect_text("usage bars --environment main", "1 helpers", actor=story.user)
    story.expect_success(f'agent edit {worker.id} --ended-at "2026-11-03T12:00:00+00:00"', actor=story.user)
    story.expect_text("usage bars --environment main", "1 helpers", actor=story.user)

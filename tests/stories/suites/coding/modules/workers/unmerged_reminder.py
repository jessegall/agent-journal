from datetime import timedelta

from suites.coding.modules.workers.support.worker_nudges import WORKER_UNMERGED
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, delivered_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

MAIN_SESSION = "s-1"
REMINDER_INTERVAL = timedelta(seconds=WORKER_UNMERGED.interval.seconds)


def test_a_worker_whose_delivered_work_is_not_merged_is_named_to_its_main_agent_again_every_interval(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    reminder = f"worker:{worker.id} delivered task:1, unmerged"
    main_lines = f"agent-line list --agent {story.agent.id}"
    story.tick(MAIN_SESSION)
    story.tick(MAIN_SESSION)
    story.expect_rows(story.run(main_lines).output_text.count(reminder) == 1)
    story.advance(REMINDER_INTERVAL)
    story.tick(MAIN_SESSION)
    story.expect_rows(story.run(main_lines).output_text.count(reminder) == 2)


def test_a_worker_whose_delivered_work_is_merged_is_not_named_again(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    reminder = f"worker:{worker.id} delivered task:1, unmerged"
    main_lines = f"agent-line list --agent {story.agent.id}"
    story.tick(MAIN_SESSION)
    story.expect_rows(story.run(main_lines).output_text.count(reminder) == 1)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    story.advance(REMINDER_INTERVAL)
    story.tick(MAIN_SESSION)
    story.expect_rows(story.run(main_lines).output_text.count(reminder) == 1)


def test_a_worker_whose_work_is_released_is_not_named_again(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    reminder = f"worker:{worker.id} delivered task:1, unmerged"
    main_lines = f"agent-line list --agent {story.agent.id}"
    story.tick(MAIN_SESSION)
    story.expect_success(f'worker release {worker.id} "not wanted"', actor=story.agent)
    story.advance(REMINDER_INTERVAL)
    story.tick(MAIN_SESSION)
    story.expect_rows(story.run(main_lines).output_text.count(reminder) == 1)


def test_a_worker_that_has_delivered_nothing_is_not_named(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.advance(REMINDER_INTERVAL)
    story.tick(MAIN_SESSION)
    story.expect_rows(f"worker:{worker.id} delivered" not in story.run(f"agent-line list --agent {story.agent.id}").output_text)

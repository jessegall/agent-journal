from tests.stories.suites.coding.modules.workers.support.commit_command import asked_for_merge
from tests.stories.core.support.agent_labels import agent_number
import pytest

from datetime import timedelta

from engine.query.queries import Queries
from core.modules.drivers.models.agent_block import AgentBlock
from engine.testing.stories.story_fixture import StoryFixture
from suites.coding.modules.workers.support.worker_nudges import WORKER_UNMERGED
from suites.coding.modules.workers.listeners.worker_merge_block_listener import WorkerMergeBlockListener
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, delivered_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.support.story_checks import expect_value
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED

TEST_ROWS_REASON = "the test reads every row it checks"

MAIN_SESSION = "s-1"
REMINDER_INTERVAL = timedelta(seconds=WORKER_UNMERGED.interval.seconds)


class MainAgentMerges(StoryFixture):
    parent = OpenTaskOrchestrator

    def steps(self, story):
        story.expect_success(f"setting set {MERGER_ENABLED} false --project", actor=story.user)


@pytest.fixture
def delivered_work(new_story):
    story = new_story(fixture=MainAgentMerges)
    repository = repository_environment(story)
    return story, repository, delivered_worker(story, repository)


def test_a_worker_whose_delivered_work_is_not_merged_is_named_to_its_main_agent_again_every_interval(delivered_work):
    story, repository, worker = delivered_work
    reminder = f"worker:{agent_number(story, worker.id)} committed task:1, not merged"
    main_lines = f"agent-line list --agent {story.agent.id}"
    story.tick(MAIN_SESSION)
    story.tick(MAIN_SESSION)
    story.expect_rows(story.run(main_lines).output_text.count(reminder) == 1)
    story.advance(REMINDER_INTERVAL)
    story.tick(MAIN_SESSION)
    story.expect_rows(story.run(main_lines).output_text.count(reminder) == 2)


def test_a_worker_whose_delivered_work_is_merged_is_not_named_again(delivered_work):
    story, repository, worker = delivered_work
    story.expect_success("proof check 1", "state: checked", actor=story.agent)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    reminder = f"worker:{agent_number(story, worker.id)} committed task:1, not merged"
    main_lines = f"agent-line list --agent {story.agent.id}"
    story.tick(MAIN_SESSION)
    story.expect_rows(story.run(main_lines).output_text.count(reminder) == 1)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    asked_for_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    story.advance(REMINDER_INTERVAL)
    story.tick(MAIN_SESSION)
    story.expect_rows(story.run(main_lines).output_text.count(reminder) == 1)


def test_a_worker_whose_work_is_released_is_not_named_again(new_story):
    story = new_story(fixture=MainAgentMerges)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    reminder = f"worker:{agent_number(story, worker.id)} committed task:1, not merged"
    main_lines = f"agent-line list --agent {story.agent.id}"
    story.tick(MAIN_SESSION)
    story.expect_success(f'worker release {agent_number(story, worker.id)} "not wanted"', actor=story.agent)
    story.advance(REMINDER_INTERVAL)
    story.tick(MAIN_SESSION)
    story.expect_rows(story.run(main_lines).output_text.count(reminder) == 1)


def test_a_worker_that_has_delivered_nothing_is_not_named(new_story):
    story = new_story(fixture=MainAgentMerges)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.advance(REMINDER_INTERVAL)
    story.tick(MAIN_SESSION)
    story.expect_rows(f"worker:{agent_number(story, worker.id)} delivered" not in story.run(f"agent-line list --agent {story.agent.id}").output_text)


def remind(story, count: int) -> None:
    for _ in range(count):
        story.advance(REMINDER_INTERVAL)
        story.tick(MAIN_SESSION)


def merge_block_rows(story, worker_id: int) -> list[AgentBlock]:
    return [row for row in story.container.get(Queries).query(AgentBlock).filter(session_agent_id=story.agent.id).every_row(TEST_ROWS_REASON)
            if f"journal worker merge {agent_number(story, worker_id)}" in row.condition_text and row.closed_at is None]


def test_a_reason_passes_only_that_hold_and_the_next_reminder_holds_again(new_story):
    story = new_story(fixture=MainAgentMerges)
    worker = delivered_worker(story, repository_environment(story))
    remind(story, 3)
    block = merge_block_rows(story, worker.id)[0]
    story.expect_success(f'agent-block skip {block.id} --reason "The user wants this held"', actor=story.agent)
    expect_value(merge_block_rows(story, worker.id), [])
    remind(story, 1)
    expect_value(len(merge_block_rows(story, worker.id)), 1)


def test_a_merged_worker_with_a_new_worktree_has_no_merge_due_block(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    story.expect_success(f"setting set {MERGER_ENABLED} false --project", actor=story.user)
    worker = checked_worker(story, repository)
    remind(story, 3)
    expect_value(len(merge_block_rows(story, worker.id)), 1)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    asked_for_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    expect_value(merge_block_rows(story, worker.id), [])
    story.expect_success(f'worker send --wait {agent_number(story, worker.id)} "Another job"', actor=story.agent)
    story.tick(MAIN_SESSION)
    expect_value(merge_block_rows(story, worker.id), [])
    remind(story, 3)
    expect_value(merge_block_rows(story, worker.id), [])


def test_a_merge_block_left_by_an_older_server_is_closed_on_the_next_tick(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    story.expect_success(f"setting set {MERGER_ENABLED} false --project", actor=story.user)
    worker = checked_worker(story, repository)
    remind(story, 3)
    expect_value(len(merge_block_rows(story, worker.id)), 1)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    with monkeypatch.context() as old_server:
        old_server.setattr(WorkerMergeBlockListener, "handle", lambda self, event, context: None)
        asked_for_merge(story, worker)
        story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    expect_value(len(merge_block_rows(story, worker.id)), 1)
    story.tick(MAIN_SESSION)
    expect_value(merge_block_rows(story, worker.id), [])

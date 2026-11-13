from tests.stories.suites.coding.modules.workers.support.commit_command import request_merge
from dataclasses import dataclass

import pytest

from engine.actor.actor import Actor
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from engine.testing.stories.story import Story
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, merged_worker_lines, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository
from tests.stories.core.support.agent_labels import agent_number


@dataclass(frozen=True)
class CheckedWork:
    story: Story
    repository: GitRepository
    worker: Actor


@pytest.fixture
def checked_work(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    return CheckedWork(story, repository, worker)


def test_a_merge_by_a_person_nudges_the_main_agent_and_wakes_it_when_idle(checked_work):
    story, worker = checked_work.story, checked_work.worker
    request_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)} --environment main", actor=story.user)
    merged_lines = merged_worker_lines(story, worker)
    story.expect_rows(len(merged_lines) == 1, merged_lines[0].wakes_agent, merged_lines[0].state is AgentLineState.WAITING)

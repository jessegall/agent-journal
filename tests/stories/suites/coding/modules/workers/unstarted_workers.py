import pytest

from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from tests.stories.suites.coding.modules.workers.gone_workers import RESUMED_PID, start_launcher, worker_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH
from tests.stories.support.story_checks import expect_value

__all__ = ["worker_story"]

BLOCK = 'task block 1 --reason "the build tool is missing"'


def newest_worker(story) -> Agent:
    return story.container.get(Queries).query(Agent).filter(role=CodingHelperRole.WORKER).newest().first()


@pytest.fixture
def launcher_story(worker_story):
    worker_story.use_processes()
    worker_story.launcher = start_launcher(worker_story, f"started {RESUMED_PID}\n".encode())
    return worker_story


@pytest.fixture
def unstarted(launcher_story):
    launcher_story.expect_success(BLOCK, actor=launcher_story.agent)
    launcher_story.expect_success(DISPATCH, actor=launcher_story.agent)
    launcher_story.run_listeners()
    launcher_story.launcher.drain_requests()
    return launcher_story


def test_a_worker_given_only_blocked_tasks_starts_nothing(unstarted):
    expect_value(unstarted.launcher.starts, [])
    expect_value(newest_worker(unstarted).pid, None)


def test_a_worker_given_only_blocked_tasks_still_holds_them(unstarted):
    unstarted.expect_text("task info 1", f"assigned to: agent {newest_worker(unstarted).id}", actor=unstarted.agent)


def test_it_starts_when_one_of_its_tasks_opens(unstarted):
    launcher = start_launcher(unstarted, f"started {RESUMED_PID}\n".encode())
    unstarted.expect_success("task unblock 1", actor=unstarted.agent)
    unstarted.run_listeners()
    launcher.drain_requests()
    expect_value([start["agent_id"] for start in launcher.starts], [newest_worker(unstarted).id])

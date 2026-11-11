from core.modules.agents.models.agent import Agent
from tests.stories.core.support.agent_labels import agent_number
import json

import pytest

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.errors.refusal import Refusal
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.drivers.commands.record_bypass_line.record_bypass_line import RecordBypassLine
from suites.coding.modules.workers.commands.open_worker_worktree.open_worker_worktree import OpenWorkerWorktree
from suites.coding.modules.workers.commands.prepare_worktree.prepare_worktree_handler import PrepareWorktreeHandler
from suites.coding.modules.workers.commands.record_worktree_cut.record_worktree_cut_handler import RecordWorktreeCutHandler
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, repository_environment

STEP_FAILURE = "this step of the dispatch failed"


def failed_step(*details: object, **options: object) -> None:
    raise Refusal(STEP_FAILURE, "try again")


def open_worktrees(story) -> list[Worktree]:
    return list(story.story_rows(Worktree))


@pytest.fixture
def dispatch_story(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    return story


def worker_rows(story) -> list[dict[str, object]]:
    return list(story.story_rows(Agent, role="worker"))


@pytest.fixture(params=[(WorktreeGit, "tip"), (WorktreeGit, "cut"), (PrepareWorktreeHandler, "handle"), (RecordWorktreeCutHandler, "handle")], ids=["tip", "cut", "prepare", "record"])
def failed_dispatch(dispatch_story, monkeypatch, request):
    story = dispatch_story
    with monkeypatch.context() as broken:
        broken.setattr(*request.param, failed_step)
        story.expect_refusal(DISPATCH, STEP_FAILURE, actor=story.agent)
    story.expect_rows(open_worktrees(story) == [], worker_rows(story) == [])
    story.expect_text("task show 1", "state: open", actor=story.agent)
    return story


@pytest.mark.real_git
def test_a_dispatch_failing_at_each_step_says_why_leaves_nothing_and_the_next_goes_through(failed_dispatch):
    failed_dispatch.expect_success(DISPATCH, actor=failed_dispatch.agent)


@pytest.mark.real_git
def test_a_dispatch_failing_once_a_row_refers_to_its_worker_ends_the_worker_and_says_why(dispatch_story, monkeypatch):
    story = dispatch_story
    bus = story.container.get(Bus)

    def line_failure(git, folder, worktree, start):
        bus.run(RecordBypassLine(worktree.session_agent_id, 1), Actor.core(), environment_id=worktree.environment_id)
        raise Refusal(STEP_FAILURE, "try again")

    with monkeypatch.context() as broken:
        broken.setattr(WorktreeGit, "cut", line_failure)
        story.expect_refusal(DISPATCH, STEP_FAILURE, actor=story.agent)
    story.expect_rows(open_worktrees(story) == [], [row.ended_at is not None for row in worker_rows(story)] == [True])
    story.expect_success(DISPATCH, actor=story.agent)


def test_a_worker_release_clears_a_worktree_left_in_state_new(dispatch_story):
    story = dispatch_story
    opened = story.container.get(Bus).run(OpenWorkerWorktree(StartAgent("s-left", "claude", CodingHelperRole.WORKER, story.agent.id), 1), story.agent, environment_id=1)
    worker_id = opened.worker.id
    story.expect_text("worker-worktree show 1", "state: new", actor=story.agent)
    story.expect_success(f'worker release {agent_number(story, worker_id)} "its dispatch failed"', actor=story.agent)
    story.expect_rows(open_worktrees(story) == [])
    story.expect_success(DISPATCH, actor=story.agent)

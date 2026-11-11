from tests.stories.core.support.agent_labels import agent_number
import json

import pytest

from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE
from tests.stories.core.modules.plugins.support.notices import expect_plugin_notice
from tests.stories.core.modules.plugins.support.worktree_plugin import worktree_plugin_folder
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, FIRST_PROOF, dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from engine.testing.expectations.expect_row import expect_row

SIN = "def total(items=[]):\n    return len(items)\n"


@pytest.fixture
def worktree_story(new_story):
    story = install_runner(new_story(fixture=OpenTaskOrchestrator))
    story.expect_success(f"plugin install {worktree_plugin_folder(story.home.project_folder)} --yes", actor=story.user)
    story.repository = repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    story.worker = dispatched_worker(story, f"{DISPATCH} 2")
    story.worker_session = worker_session(story, story.worker)
    story.worktree = story.repository.worktree_folder(story.worker.id)
    story.run(FIRST_PROOF, actor=story.worker)
    return story


def test_a_main_checkout_sin_reaches_only_the_main_agent(worktree_story):
    story = worktree_story
    story.repository.uncommitted("cart.py", SIN)
    scanned_edit(story, "s-1", "cart.py", folder=story.repository.folder)
    story.run_listeners()
    story.expect_absent_hook_line(story.worker_session, LISTING_SAMPLE, "mutable default")
    expect_plugin_notice(story, LISTING_SAMPLE, f"[plugin worktree-judge] {story.repository.folder / 'cart.py'}: mutable default")


@pytest.mark.parametrize("command", ["worker commit --differences none", "worker deliver --differences none"])
def test_both_names_of_the_worker_commit_judge_the_worker_files_from_its_base(worktree_story, command):
    story = worktree_story
    story.repository.changed(story.worker.id, "cart.py", SIN)
    story.expect_refusal(command, f"{story.worktree / 'cart.py'}: mutable default", actor=story.worker)


def test_a_resumed_worker_is_not_judged_for_new_main_commits(worktree_story):
    story = worktree_story
    story.repository.changed(story.worker.id, "cart.py", "TOTAL = 1\n")
    story.repository.checkout(ENVIRONMENT_BRANCH)
    story.repository.committed("main_only.py", SIN, "Main adds a function")
    story.expect_success(f'worker send --wait {agent_number(story, story.worker.id)} "Continue the worker changes"', actor=story.agent)
    story.expect_rows((story.worktree / "main_only.py").read_text() == SIN)
    story.expect_success("worker commit --wait --differences none", actor=story.worker)
    data = json.loads((story.home.folder / "plugin-data/worktree-judge/delivery.json").read_text())
    expect_row(data, base=story.repository.tip(ENVIRONMENT_BRANCH))
    expect_row(data, files=["cart.py"])


def test_a_resumed_workers_new_sin_still_holds_its_handoff(worktree_story):
    story = worktree_story
    story.repository.checkout(ENVIRONMENT_BRANCH)
    story.repository.committed("main_only.py", SIN, "Main adds a function")
    story.expect_success(f'worker send --wait {agent_number(story, story.worker.id)} "Add the worker function"', actor=story.agent)
    story.repository.changed(story.worker.id, "cart.py", SIN)
    story.expect_refusal("worker commit --wait --differences none", f"{story.worktree / 'cart.py'}: mutable default", actor=story.worker)

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.base.driver.tool_type import ToolType
from core.testing.expect_reply import expect_reply_refusal
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from suites.coding.modules.workers.models.enums.ask_topic import AskTopic
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DELIVERY, FIRST_PROOF, dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.judge_plugin import SINFUL_TEXT, judge_plugin_folder
from tests.stories.suites.coding.modules.workers.support.merger_launcher import expect_refused_with
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, shell_test_part, start_planned_worker
from tests.stories.suites.coding.modules.workers.hand_in_rebase import moved_base_worker
from tests.stories.suites.coding.modules.workers.worker_guidance import clashed  # noqa: F401

WORKER_TAX = "TAX = 2\n"
MAIN_TAX = "TAX = 3\n"


@pytest.fixture
def working(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    return story, repository, dispatched_worker(story)


@pytest.fixture
def proven(working):
    story, _, worker = working
    story.expect_success(FIRST_PROOF, actor=worker)
    return working


@pytest.fixture
def planned_worker(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    worker.story.expect_success("setting set journal.suites.coding.workers.worker-phase-test-runs 0 --environment main", actor=worker.story.user)
    return worker


@pytest.mark.real_git
def test_a_judge_refusal_at_a_hand_in_ends_with_the_ask_line(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"plugin install {judge_plugin_folder(story.home.folder.parent)} --yes", actor=story.user)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", SINFUL_TEXT)
    story.expect_success(FIRST_PROOF, actor=worker)
    expect_refused_with(story, DELIVERY, "cart.py has a sin", AskTopic.JUDGE.question_line(), actor=worker)


def test_a_test_refused_after_its_allowance_ends_with_the_ask_line(planned_worker):
    expect_reply_refusal(planned_worker.run_test(), AskTopic.TESTS.question_line())


def test_a_test_line_outside_the_named_commands_ends_with_the_ask_line(planned_worker):
    expect_reply_refusal(planned_worker.run_line(TEST_LINE, shell_test_part(TEST_LINE)), AskTopic.TESTS.question_line())


def test_a_hand_in_with_no_change_ends_with_the_ask_line(proven):
    story, _, worker = proven
    expect_refused_with(story, DELIVERY, "your worktree has no change", AskTopic.BUILT.question_line(), actor=worker)


@pytest.mark.real_git
def test_a_hand_in_that_clashes_ends_with_the_ask_line(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = moved_base_worker(story, repository)
    repository.changed(worker.id, "tax.py", WORKER_TAX)
    repository.committed("tax.py", MAIN_TAX, "Another tax")
    expect_refused_with(story, DELIVERY, f"your work clashes with {ENVIRONMENT_BRANCH} in tax.py", AskTopic.CONFLICT.question_line(), actor=worker)


def test_the_clash_line_of_a_merge_ends_with_the_ask_line(clashed):  # noqa: F811
    story, worker, _ = clashed
    story.expect_text(f"agent-line list --agent {worker.id}", "clashes on", AskTopic.CONFLICT.question_line())


def test_status_at_a_clash_also_gives_the_ask_line(clashed):  # noqa: F811
    story, worker, _ = clashed
    story.expect_text("worker status", AskTopic.CONFLICT.question_line(), actor=worker)


def test_git_refused_for_a_worker_ends_with_the_ask_line(working):
    story, _, worker = working
    git_status = HookSamples.shell("git status", ShellPart("git", CommandCategory.VERSION_CONTROL, ["status"]))
    story.expect_hook_refusal(worker_session(story, worker), git_status, AskTopic.TOOL.question_line())


def test_a_command_type_refused_for_a_worker_ends_with_the_ask_line(working):
    story, _, worker = working
    unknown_command = HookSamples.shell("frobnicate now", ShellPart("frobnicate", CommandCategory.UNKNOWN, ["now"]))
    story.expect_hook_refusal(worker_session(story, worker), unknown_command, AskTopic.TOOL.question_line())


def test_a_stop_refused_for_a_worker_ends_with_the_ask_line(working):
    story, _, worker = working
    story.expect_hook_refusal(worker_session(story, worker), HookSamples.stop(), AskTopic.GENERAL.question_line())


def test_a_hand_in_with_a_point_unproven_ends_with_the_ask_line(working):
    story, repository, worker = working
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    expect_refused_with(story, DELIVERY, "point 1 has no proof", AskTopic.GENERAL.question_line(), actor=worker)


def test_a_change_in_a_protected_folder_ends_with_the_ask_line(working):
    story, repository, worker = working
    story.expect_success('setting set journal.suites.coding.workers.protected-folders \'["cart.py"]\' --project', actor=story.user)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=worker)
    expect_refused_with(story, DELIVERY, "cart.py is protected", AskTopic.TOOL.question_line(), actor=worker)


def test_a_refusal_about_a_file_outside_the_worktree_carries_no_ask_line(working):
    story, _, worker = working
    read_outside = HookSamples.tool_use("Read", ToolType.READ, ["/etc/hosts"], None)
    reply = story.hook(worker_session(story, worker), read_outside)
    story.expect_rows("journal worker ask" not in str(reply), detail=str(reply))

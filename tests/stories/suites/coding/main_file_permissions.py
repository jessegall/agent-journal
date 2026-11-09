import pytest
from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.fake_launcher import FakeLauncher
from suites.coding.modules.workers.support.coding_main_options import CodingMainOptions
from tests.stories.core.modules.helpers.start_helper import START
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder, UserBuilder, OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.support.main_controls_fixture import MainControlsActors, agent_actors, scope_line
from tests.stories.support.story_checks import expect_value

AUTO = "journal.suites.coding.auto-mode"
WRITES_CODE = "journal.suites.coding.main-writes-code"
DISPATCHES = "journal.suites.coding.workers.main-dispatches-workers"
HELPERS = "journal.suites.coding.main-starts-read-only-helpers"
DESIGNER = "journal.suites.coding.designer-enabled"
MERGE = "journal.suites.coding.workers.main-agent-may-merge"
WORKER_HELPERS = "journal.suites.coding.workers.workers-start-read-only-helpers"
PROJECT_FILE = "/work/journal/cart.py"
EXTERNAL_FILE = "/home/ada/.claude/memory/notes.md"
WORKTREE_FILE = "/work/journal/.journal/worktrees/development/worker-1/cart.py"
MAIN_SESSION = "s-1"


def sed_edit(line: str):
    return HookSamples.shell(line, ShellPart("sed", CommandCategory.EDIT, line.split()[1:], effects=[CommandEffect.WRITES_FILES]))


def refused_with_launcher(story, line, reason, actor):
    launcher = FakeLauncher.listening(story.home.socket("launcher"), request_count=1)
    story.expect_refusal(line, reason, actor=actor)
    launcher.server.close()
    story.home.socket("launcher").unlink()


@pytest.mark.parametrize("auto,writes_code,allowed", [("on", "on", True), ("off", "on", True), ("on", "off", False), ("off", "off", False)])
def test_s01_auto_and_the_code_switch_are_separate(new_story, auto, writes_code, allowed):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {AUTO} {auto} --environment main", actor=story.user)
    story.expect_success(f"setting set {WRITES_CODE} {writes_code} --environment main", actor=story.user)
    if allowed:
        story.expect_hook_allowed(MAIN_SESSION, HookSamples.edit(PROJECT_FILE))
        return
    story.expect_hook_refusal(MAIN_SESSION, HookSamples.edit(PROJECT_FILE), "writes no code")


def test_s01_writing_no_code_refuses_the_main_agent_starting_a_task_and_a_person_still_may(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    story.expect_success(f"setting set {WRITES_CODE} off --environment main")
    story.expect_refusal("task start 1", "goes to a worker", actor=story.agent)
    story.expect_text("task show 1", "state: open", actor=story.agent)

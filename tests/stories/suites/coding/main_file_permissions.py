from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.fake_launcher import FakeLauncher
from suites.coding.support.coding_main_options import CodingMainOptions
from tests.stories.core.modules.helpers.start_helper import START
from tests.stories.core.support.coding_fixtures import BuilderWithOpenTask, BuilderWithUser, OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.support.main_controls_fixture import MainControlsActors, agent_actors, in_environment
from tests.stories.support.story_checks import expect_value

AUTO = "journal.suites.coding.auto-mode"
DISPATCHES = "journal.suites.coding.workers.builder-dispatches-workers"
HELPERS = "journal.suites.coding.builder-starts-helpers"
DESIGNER = "journal.suites.coding.designer-enabled"
MERGE = "journal.suites.coding.workers.main-agent-may-merge"
WORKER_HELPERS = "journal.suites.coding.workers.workers-start-helpers"
PROJECT_FILE = "/work/journal/cart.py"
OUTSIDE_FILE = "/home/ada/.claude/memory/notes.md"
WORKTREE_FILE = "/work/journal/.journal/worktrees/development/worker-1/cart.py"
MAIN_SESSION = "s-1"


def sed_edit(line: str):
    return HookSamples.shell(line, ShellPart("sed", CommandCategory.EDIT, line.split()[1:], effects=[CommandEffect.WRITES_FILES]))


def refused_with_launcher(story, line, reason, actor):
    launcher = FakeLauncher(story.home.socket("launcher"), request_count=1)
    story.expect_refusal(line, reason, actor=actor)
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_s01_auto_off_refuses_a_main_edit_of_a_project_file_only(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {AUTO} off --environment main", actor=story.user)
    story.expect_hook_refusal(MAIN_SESSION, HookSamples.edit(PROJECT_FILE), "auto mode is off")
    story.expect_hook_allowed(MAIN_SESSION, HookSamples.edit(OUTSIDE_FILE))
    story.expect_hook_allowed(MAIN_SESSION, HookSamples.edit(WORKTREE_FILE))


def test_s01_auto_on_leaves_a_main_edit_of_a_project_file_allowed(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_hook_allowed(MAIN_SESSION, HookSamples.edit(PROJECT_FILE))


def test_s01_auto_off_refuses_a_main_shell_write_and_allows_a_journal_command(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {AUTO} off --environment main", actor=story.user)
    story.expect_hook_refusal(MAIN_SESSION, sed_edit("sed -i s/a/b/ cart.py"), "auto mode is off")
    journal_line = HookSamples.shell("journal task list", ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"]))
    story.expect_hook_allowed(MAIN_SESSION, journal_line)


def test_s01_auto_off_refuses_the_main_agent_starting_a_task_and_a_person_still_may(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.expect_success(f"setting set {AUTO} off --environment main")
    story.expect_refusal("task start 1", "goes to a worker", actor=story.agent)
    story.expect_text("task show 1", "state: open", actor=story.agent)


def test_s02_main_dispatch_is_refused_at_the_command_when_sending_workers_is_off(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    repository_environment(story)
    story.expect_success(f"setting set {DISPATCHES} off --environment main")
    story.expect_refusal(DISPATCH, "sends no workers", actor=story.agent)
    story.expect_no_text("worker-worktree list", "state:", actor=story.agent)


def test_s06_main_helper_start_is_refused_at_the_command_when_ordinary_helpers_are_off(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {HELPERS} off --project", actor=story.user)
    refused_with_launcher(story, START, "starts no helper", story.agent)
    story.expect_no_text("agent list", "role: helper", actor=story.user)


def test_s07_the_designer_is_off_by_default_and_only_a_person_changes_it(new_story):
    story = new_story(fixture=BuilderWithUser)
    with in_environment(story):
        expect_value(story.container.get(CodingMainOptions).options().designer, False)
    story.expect_refusal(f"setting set {DESIGNER} on --environment main", "only a person changes", actor=story.agent)
    story.expect_success(f"setting set {DESIGNER} on --environment main", actor=story.user)


def test_s09_main_merge_is_refused_when_the_main_may_not_merge(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"setting set {MERGE} off --environment main")
    story.expect_refusal(f"worker merge --wait {worker.id}", "merges no worker", actor=story.agent)
    story.expect_text("worker-worktree show 1", "state: delivered", actor=story.agent)


def test_s43_a_worker_starts_no_helper_when_workers_may_not_use_helpers(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_success(f"setting set {WORKER_HELPERS} off --environment main", actor=story.user)
    refused_with_launcher(story, START, "starts no helper", agent_actors(story)["worker"])

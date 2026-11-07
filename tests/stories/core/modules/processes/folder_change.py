from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted

MOVE = HookSamples.shell("cd build && ls", ShellPart("cd", CommandCategory.UNKNOWN, ["build"]), ShellPart("ls", CommandCategory.READ, []))
CURRENT_FOLDER_HOOK = HookSamples.shell("cd /work/main && ls", ShellPart("cd", CommandCategory.UNKNOWN, ["/work/main"]), ShellPart("ls", CommandCategory.READ, []))


def test_an_agent_that_moves_with_cd_is_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_hook_refusal("s-1", MOVE.with_raw({"cwd": "/work/main"}), "do not move with cd")


def test_a_cd_into_the_folder_it_is_in_goes_through(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_hook_allowed("s-1", CURRENT_FOLDER_HOOK.with_raw({"cwd": "/work/main"}))

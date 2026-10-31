from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import runner_line
from tests.stories.core.support.coding_fixtures import BuilderStarted

BUILD = HookSamples.shell("make build", ShellPart("make", CommandCategory.BUILD, ["build"]))
SLEEP_LOOP = HookSamples.shell("until pgrep -f build; do sleep 5; done", ShellPart("until", CommandCategory.PROCESS, ["pgrep"]))
PLAIN_SLEEP = HookSamples.shell("sleep 30", ShellPart("sleep", CommandCategory.PROCESS, ["30"]))
BUSY_LOOP = HookSamples.shell("until pgrep -f build; do tail -n 1 build.log; sleep 5; done", ShellPart("until", CommandCategory.PROCESS, ["pgrep"]))


def test_a_sleep_loop_is_refused_naming_the_process_the_agent_has_running_and_how_to_watch_it(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", BUILD)
    story.expect_hook_refusal("s-1", SLEEP_LOOP, "journal output watch 1")


def test_a_plain_sleep_is_refused(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_refusal("s-1", PLAIN_SLEEP, "a sleep with nothing to wait on is refused")


def test_a_loop_that_does_real_work_between_its_sleeps_goes_on_through_the_runner(new_story):
    story = new_story(fixture=BuilderStarted)
    assert dict(story.hook("s-1", BUSY_LOOP).updated_input) == {"command": runner_line(1, "until pgrep -f build; do tail -n 1 build.log; sleep 5; done")}

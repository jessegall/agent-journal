from engine.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner, runner_line
from tests.stories.core.support.coding_fixtures import BuilderStarted
BUILD = HookSamples.shell("make build", ShellPart("make", CommandCategory.BUILD, ["build"]))
SLEEP_LOOP = HookSamples.shell("until pgrep -f build; do sleep 5; done", ShellPart("until", CommandCategory.PROCESS, ["pgrep"]))
PLAIN_SLEEP = HookSamples.shell("sleep 30", ShellPart("sleep", CommandCategory.PROCESS, ["30"]))
BUSY_LOOP = HookSamples.shell("until pgrep -f build; do tail -n 1 build.log; sleep 5; done", ShellPart("until", CommandCategory.PROCESS, ["pgrep"]))


def test_a_sleep_loop_is_refused_naming_the_process_the_agent_has_running_and_how_to_watch_it(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.hook("s-1", BUILD)
    story.expect_hook_refusal("s-1", SLEEP_LOOP, "you are told when a run ends")


def monitor_enabled(command):
    return HookSamples.sample("pre_tool_use", {"name": "Monitor", "category": "monitor", "input": {"command": command}}).with_raw({"tool_input": {"command": command}})


def test_a_hand_made_wait_on_an_output_is_refused_naming_the_command_and_that_command_goes_through(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_hook_refusal("s-1", monitor_enabled("until journal output read 7 --summary | grep -q passed; do sleep 2; done"), "give the Monitor the output wait")
    story.expect_hook_allowed("s-1", monitor_enabled("journal output monitor 7"))
    story.expect_hook_allowed("s-1", monitor_enabled("tail -f server.log"))


def test_the_sleep_tool_of_an_agent_program_is_refused(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_refusal("s-1", HookSamples.sample("pre_tool_use", {"name": "clocksleep", "category": "other", "files": []}), "a sleep is refused")

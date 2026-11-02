from core.base.driver.command_category import CommandCategory
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
    story.expect_hook_refusal("s-1", SLEEP_LOOP, "give the run to a Monitor")


def test_a_plain_sleep_is_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_hook_refusal("s-1", PLAIN_SLEEP, "a sleep with nothing to wait on is refused")


def test_a_loop_that_does_real_work_between_its_sleeps_goes_on_through_the_runner(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    assert dict(story.hook("s-1", BUSY_LOOP).updated_input) == {"command": runner_line(story, 1, "until pgrep -f build; do tail -n 1 build.log; sleep 5; done")}


def monitor_on(command):
    return HookSamples.sample("pre_tool_use", {"name": "Monitor", "category": "monitor", "input": {"command": command}}).with_fields(raw={"tool_input": {"command": command}})


def test_the_monitor_command_is_refused_as_a_plain_command(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    plain = HookSamples.shell("journal output monitor 7", ShellPart("journal", CommandCategory.JOURNAL, ["output", "monitor", "7"], subcommand="output"))
    story.expect_hook_refusal("s-1", plain, "journal output monitor runs only in a Monitor")


def test_a_line_that_only_names_the_monitor_command_is_not_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    grep_line = HookSamples.shell('grep -n "journal output monitor" notes.md', ShellPart("grep", CommandCategory.SEARCH, ["-n", "journal output monitor", "notes.md"]))
    assert "runs only in a Monitor" not in story.hook("s-1", grep_line).refusal


def test_a_hand_made_wait_on_an_output_is_refused_naming_the_command_and_that_command_goes_through(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_hook_refusal("s-1", monitor_on("until journal output read 7 --summary | grep -q passed; do sleep 2; done"), "journal output monitor <n>")
    story.expect_hook_allowed("s-1", monitor_on("journal output monitor 7"))
    story.expect_hook_allowed("s-1", monitor_on("tail -f server.log"))

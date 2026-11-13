from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner, runner_line
from tests.stories.core.support.coding_fixtures import BuilderStarted, OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
BUILD = HookSamples.shell("make build", ShellPart("make", CommandCategory.BUILD, ["build"]))
SLEEP_LOOP = HookSamples.shell("until pgrep -f build; do sleep 5; done", ShellPart("until", CommandCategory.PROCESS, ["pgrep"]))
WAITING_SLEEP = HookSamples.shell("sleep 30", ShellPart("sleep", CommandCategory.READ, ["30"]))
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
    story.expect_hook_refusal("s-1", monitor_enabled("until journal output read 7 --summary | grep -q passed; do sleep 2; done"), "give the output wait to the Monitor")
    story.expect_hook_allowed("s-1", monitor_enabled("journal output monitor 7"))
    story.expect_hook_allowed("s-1", monitor_enabled("tail -f server.log"))


def test_the_sleep_tool_of_an_agent_program_is_refused(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_refusal("s-1", HookSamples.sample("pre_tool_use", {"name": "clocksleep", "category": "other", "files": []}), "No sleeps")


def test_a_worker_and_the_main_agent_hear_the_same_sleep_refusal(new_story):
    story = install_runner(new_story(fixture=OpenTaskOrchestrator))
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    story.run("task overview 1", actor=worker)
    story.expect_hook_refusal(session, WAITING_SLEEP, "No sleeps: you are told when a run ends")
    story.expect_hook_refusal("s-1", WAITING_SLEEP, "No sleeps: you are told when a run ends")

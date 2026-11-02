from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

BUILD = HookSamples.shell("make build", ShellPart("make", CommandCategory.UNKNOWN, ["build"]))


def monitor(command: str):
    return HookSamples.sample("pre_tool_use", {"name": "Monitor", "category": "monitor", "input": {"command": command}}).with_raw({"tool_input": {"command": command}})


def test_a_background_run_with_no_monitor_holds_the_agent(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make test")
    story.expect_hook_refusal("s-1", BUILD, f"journal output monitor {process.id}")


def test_a_monitor_on_the_run_lets_the_agent_go_on(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make test")
    story.hook("s-1", monitor(f"journal output monitor {process.id}"))
    assert "set a Monitor" not in story.hook("s-1", BUILD).refusal


def test_a_monitor_on_another_run_does_not_let_the_agent_go_on(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make test")
    story.hook("s-1", monitor(f"journal output monitor {process.id + 1}"))
    story.expect_hook_refusal("s-1", BUILD, f"journal output monitor {process.id}")


def test_a_run_that_ended_no_longer_holds_the_agent(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make test")
    end_run(story, process, "done\n")
    assert "set a Monitor" not in story.hook("s-1", BUILD).refusal

import pytest

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, monitor, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.testing.expect_reply import expect_absent_reply_refusal, expect_reply_allowed

BUILD = HookSamples.shell("make build", ShellPart("make", CommandCategory.UNKNOWN, ["build"]))


@pytest.fixture
def running(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    return story, moved_run(story, "make test")


def test_a_moved_run_with_no_monitor_leaves_the_agent_working(running):
    story, _ = running
    expect_reply_allowed(story.hook("s-1", BUILD))


def test_a_stop_with_a_run_going_and_no_monitor_is_refused(running):
    story, process = running
    story.expect_hook_refusal("s-1", HookSamples.stop(), f"set a Monitor on journal output monitor {process.id} before you stop")


def test_a_monitor_on_the_run_lets_the_agent_stop(running):
    story, process = running
    story.hook("s-1", monitor(f"journal output monitor {process.id}"))
    expect_absent_reply_refusal(story.hook("s-1", HookSamples.stop()), "set a Monitor")


def test_a_monitor_on_another_run_does_not_let_the_agent_stop(running):
    story, process = running
    story.hook("s-1", monitor(f"journal output monitor {process.id + 1}"))
    story.expect_hook_refusal("s-1", HookSamples.stop(), f"journal output monitor {process.id}")


def test_each_running_output_needs_its_own_monitor(running):
    story, first = running
    second = moved_run(story, "make build")
    story.expect_hook_refusal("s-1", HookSamples.stop(), f"journal output monitor {first.id}")
    story.hook("s-1", monitor(f"journal output monitor {first.id}"))
    story.expect_hook_refusal("s-1", HookSamples.stop(), f"journal output monitor {second.id}")
    story.hook("s-1", monitor(f"journal output monitor {second.id}"))
    expect_absent_reply_refusal(story.hook("s-1", HookSamples.stop()), "set a Monitor")


def test_a_run_that_ended_no_longer_holds_the_stop(running):
    story, process = running
    end_run(story, process, "done\n")
    expect_absent_reply_refusal(story.hook("s-1", HookSamples.stop()), "set a Monitor")


def test_a_run_that_ended_while_the_agent_worked_needs_no_monitor_at_the_stop(running):
    story, process = running
    end_run(story, process, "done\n")
    story.hook("s-1", BUILD)
    expect_absent_reply_refusal(story.hook("s-1", HookSamples.stop()), "set a Monitor")

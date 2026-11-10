from datetime import timedelta

import pytest

from engine.command.bus import Bus
from engine.driver.command_category import CommandCategory
from core.modules.processes.commands.move_process.move_process import MoveProcess
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, monitor, moved_run, started_run
from tests.stories.core.support.coding_fixtures import BuilderStarted
from engine.testing.expectations.expect_reply import expect_absent_reply_refusal, expect_reply_allowed

BUILD = HookSamples.shell("make build", ShellPart("make", CommandCategory.UNKNOWN, ["build"]))


@pytest.fixture
def running(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    return story, moved_run(story, "make test")


def test_each_running_output_needs_its_own_monitor(running):
    story, first = running
    second = moved_run(story, "make build")
    story.expect_hook_refusal("s-1", HookSamples.stop(), f"output {first.id} still runs")
    story.hook("s-1", monitor(f"journal output monitor {first.id}"))
    story.expect_hook_refusal("s-1", HookSamples.stop(), f"output {second.id} still runs")
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


def test_a_monitor_set_while_the_run_still_waited_lets_the_agent_stop_once_the_run_moves_to_the_background(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.advance(timedelta(seconds=2))
    process = started_run(story, "make test")
    story.hook("s-1", monitor(f"journal output monitor {process.id}"))
    story.container.get(Bus).run(MoveProcess(process.id), story.agent, environment_id=1)
    expect_absent_reply_refusal(story.hook("s-1", HookSamples.stop()), "set a Monitor")


def test_a_monitor_whose_life_ended_before_the_run_moved_does_not_let_the_agent_stop(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.advance(timedelta(seconds=1))
    process = started_run(story, "make build")
    story.hook("s-1", monitor(f"journal output monitor {process.id}"))
    story.advance(timedelta(minutes=31))
    story.container.get(Bus).run(MoveProcess(process.id), story.agent, environment_id=1)
    story.expect_hook_refusal("s-1", HookSamples.stop(), f"output {process.id} still runs")

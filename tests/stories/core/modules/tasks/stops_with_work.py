from datetime import timedelta

import pytest

from engine.enums.tool_type import ToolType
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import BuilderStarted, StartedTaskBuilder
from core.modules.tasks.nudges.blocked_tasks_nudge import BlockedTasksNudge
from engine.testing.expectations.expected_nudge import expected_nudge

READ = HookSamples.sample("pre_tool_use", {"name": "Read", "category": ToolType.READ, "files": ["a.py"], "shell": None, "diff": None})


@pytest.fixture
def skipped_stop(new_story):
    """The agent with a task in hand was refused its stop and skipped that refusal with a reason."""
    story = new_story(fixture=StartedTaskBuilder)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "is in hand: continue")
    story.advance(timedelta(seconds=1))
    story.expect_success("refusal skip tasks.carry-on-at-stop --reason 'waiting for the price list'", actor=story.agent)
    return story


def test_a_builder_with_only_blocked_tasks_is_refused_at_its_first_stop_and_not_its_second(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(lines.NEW_TASK)
    story.run("task block 1 --reason 'waits for the price list'")
    story.expect_hook_refusal("s-1", HookSamples.stop(), expected_nudge(BlockedTasksNudge.declared()))
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_the_task_in_hand_stop_refusal_is_silent_while_a_run_of_the_agent_goes_and_returns_once_it_ends(new_story):
    story = install_runner(new_story(fixture=StartedTaskBuilder))
    process = start_process(story, "make build")
    story.expect_rows("is in hand" not in story.hook("s-1", HookSamples.stop()).refusal)
    story.hook("s-1", HookSamples.sample("pre_tool_use", {"name": "Monitor", "category": "monitor", "input": {"command": "wait"}}))
    story.expect_hook_allowed("s-1", HookSamples.stop())
    end_run(story, process, "done\n")
    story.expect_hook_refusal("s-1", HookSamples.stop(), "is in hand: continue")


def test_a_skip_silences_the_task_in_hand_stop_refusal_for_25_minutes_and_it_returns_after_them(skipped_stop):
    story = skipped_stop
    story.hook("s-1", HookSamples.stop())
    story.expect_hook_allowed("s-1", HookSamples.stop())
    story.advance(timedelta(minutes=24))
    story.expect_hook_allowed("s-1", HookSamples.stop())
    story.advance(timedelta(minutes=2))
    story.expect_hook_refusal("s-1", HookSamples.stop(), "is in hand: continue")


def test_a_skip_of_the_task_in_hand_stop_refusal_ends_after_25_tool_uses(skipped_stop):
    story = skipped_stop
    for _ in range(25):
        story.advance(timedelta(seconds=1))
        story.hook("s-1", READ)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "is in hand: continue")

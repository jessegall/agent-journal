from datetime import timedelta

import pytest

from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import BuilderStarted, StartedTaskBuilder


@pytest.fixture
def skipped_stop(new_story):
    """The agent with a task in hand was refused its stop, skipped that refusal with a reason and confirmed the skip."""
    story = new_story(fixture=StartedTaskBuilder)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "is in hand: continue")
    story.advance(timedelta(seconds=1))
    skip_id = story.new_row_id("refusal skip tasks.carry-on-at-stop --reason 'waiting for the price list'", actor=story.agent)
    story.expect_success(f"refusal confirm {skip_id} --tried 'asked the user for the price list'", actor=story.agent)
    return story


def test_a_builder_with_only_blocked_tasks_is_told_them_at_its_first_stop_and_not_its_second(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(lines.NEW_TASK)
    story.run("task block 1 --reason 'waits for the price list'")
    story.expect_hook_allowed("s-1", HookSamples.stop())
    story.expect_hook_allowed("s-1", HookSamples.stop())
    story.expect_text(f"agent-line list --agent {story.agent.id} --state waiting", "tasks.blocked-work-at-stop", actor=story.user)
    story.expect_rows(story.run(f"agent-line list --agent {story.agent.id} --state waiting", actor=story.user).output_text.count("tasks.blocked-work-at-stop") == 1)


def test_the_task_in_hand_stop_refusal_is_silent_while_a_run_of_the_agent_goes_and_returns_once_it_ends(new_story):
    story = install_runner(new_story(fixture=StartedTaskBuilder))
    process = start_process(story, "make build")
    story.expect_rows("is in hand" not in story.hook("s-1", HookSamples.stop()).refusal)
    story.hook("s-1", HookSamples.sample("pre_tool_use", {"name": "Monitor", "category": "monitor", "input": {"command": "wait"}}))
    story.expect_hook_allowed("s-1", HookSamples.stop())
    end_run(story, process, "done\n")
    story.expect_hook_refusal("s-1", HookSamples.stop(), "is in hand: continue")


def test_a_confirmed_skip_passes_the_task_in_hand_stop_refusal_once_and_the_next_stop_is_refused_again(skipped_stop):
    story = skipped_stop
    story.expect_hook_allowed("s-1", HookSamples.stop())
    story.advance(timedelta(seconds=1))
    story.expect_text("driver-grant show 1", "grant_state: spent", actor=story.user)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "is in hand: continue")

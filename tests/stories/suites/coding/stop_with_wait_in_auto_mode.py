import pytest

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder
from suites.coding.support.coding_settings import AUTO_MODE_SETTING
from core.modules.tasks.support.task_nudges import CURRENT_TASK

WAITS = {
    "wait on a task": "wait on 'the deploy' --target tasks:2",
    "stuck report": "wait stuck 'the build server is down'",
}


def declare_wait(story, wait: str) -> None:
    story.run('task make "The deploy" --environment main', actor=story.agent)
    story.run('task block 2 --reason "waits for the release"', actor=story.agent)
    story.run(WAITS[wait], actor=story.agent)


@pytest.mark.parametrize("wait", WAITS)
def test_in_auto_mode_a_stop_with_a_started_task_is_refused_while_a_wait_is_open(new_story, wait):
    story = new_story(fixture=StartedTaskBuilder)
    story.run(f"setting set {AUTO_MODE_SETTING} on --environment main")
    declare_wait(story, wait)
    story.expect_hook_refusal("s-1", HookSamples.stop(), f"{CURRENT_TASK.nudge(task=1).text}: continue")
    story.expect_hook_refusal("s-1", HookSamples.stop(), f"{CURRENT_TASK.nudge(task=1).text}: continue")


def test_in_auto_mode_a_stop_with_a_started_task_is_refused_without_a_wait(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.run(f"setting set {AUTO_MODE_SETTING} on --environment main")
    story.expect_hook_refusal("s-1", HookSamples.stop(), f"{CURRENT_TASK.nudge(task=1).text}: continue")


@pytest.mark.parametrize("move", ['task block 1 --reason "waits for the price list"', 'task close 1 --outcome "done"', 'task cancel 1 --reason "not needed"'])
def test_in_auto_mode_the_stop_is_allowed_once_the_task_is_blocked_completed_or_cancelled(new_story, move):
    story = new_story(fixture=StartedTaskBuilder)
    story.run(f"setting set {AUTO_MODE_SETTING} on --environment main")
    story.run(WAITS["stuck report"], actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.stop(), f"{CURRENT_TASK.nudge(task=1).text}: continue")
    story.run(move, actor=story.agent)
    story.expect_hook_silent("s-1", HookSamples.stop())

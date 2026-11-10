import pytest

from datetime import timedelta

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder

INACTIVE_MINUTES = 15


def test_a_builder_quiet_with_its_task_in_hand_is_reminded_on_a_tick(task_turn):
    story = task_turn
    story.expect_text(f"agent-line list --agent {story.agent.id} --state waiting", f"nothing has happened for {INACTIVE_MINUTES} minutes", "tasks.quiet-task")


def test_a_builder_is_reminded_by_a_tick_that_comes_late(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.advance(timedelta(minutes=INACTIVE_MINUTES + 2))
    story.tick("s-1")
    story.expect_text(f"agent-line list --agent {story.agent.id} --state waiting", f"nothing has happened for {INACTIVE_MINUTES} minutes")


def test_a_builder_is_reminded_once_per_quiet_stretch(task_turn):
    story = task_turn
    story.advance(timedelta(minutes=1))
    story.tick("s-1")
    reply = story.hook("s-1", HookSamples.prompt("and on"))
    story.expect_rows(sum("nothing has happened" in line for line in reply.lines) == 1)

@pytest.fixture
def task_turn(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.advance(timedelta(minutes=INACTIVE_MINUTES))
    story.tick("s-1")
    return story

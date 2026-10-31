from datetime import timedelta

from core.modules.tasks.carry_on_refusal import STOP_REFUSALS_PER_LOG
from core.testing.hook_samples import HookSamples
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import BuilderStarted, BuilderWithStartedTask


def test_a_builder_that_stops_with_its_task_in_hand_is_told_to_carry_on(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "task 1, Fix the cart, is in hand: carry on")


def test_a_builder_told_to_carry_on_enough_times_since_its_last_log_stops(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    for _ in range(STOP_REFUSALS_PER_LOG):
        story.hook("s-1", HookSamples.stop())
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_a_log_line_lets_the_carry_on_refusal_speak_again(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    for _ in range(STOP_REFUSALS_PER_LOG):
        story.hook("s-1", HookSamples.stop())
    story.advance(timedelta(minutes=1))
    story.run("task log 1 'the totals are worked out'", actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "task 1, Fix the cart, is in hand: carry on")


def test_a_builder_with_only_blocked_tasks_is_refused_at_its_first_stop_and_not_its_second(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(lines.NEW_TASK)
    story.run("task block 1 --reason 'waits for the price list'")
    story.expect_hook_refusal("s-1", HookSamples.stop(), "blocked tasks: 1")
    story.expect_hook_allowed("s-1", HookSamples.stop())

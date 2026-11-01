from core.testing.hook_samples import HookSamples
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import BuilderStarted, BuilderWithStartedTask


def test_a_builder_that_stops_with_its_task_in_hand_is_told_to_carry_on(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "task 1, Fix the cart, is in hand: carry on")


def test_a_builder_is_told_to_carry_on_at_every_stop_while_its_task_is_in_hand(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    for _ in range(12):
        story.expect_hook_refusal("s-1", HookSamples.stop(), "task 1, Fix the cart, is in hand: carry on")


def test_a_builder_with_only_blocked_tasks_is_refused_at_its_first_stop_and_not_its_second(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(lines.NEW_TASK)
    story.run("task block 1 --reason 'waits for the price list'")
    story.expect_hook_refusal("s-1", HookSamples.stop(), "blocked tasks: 1")
    story.expect_hook_allowed("s-1", HookSamples.stop())

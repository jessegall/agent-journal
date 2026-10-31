from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask


def test_a_builder_whose_session_starts_again_is_told_its_task_and_its_last_log(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.run("task log 1 'the totals are worked out'", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.session_start(), "task 1, Fix the cart, is in hand; last log: the totals are worked out")


def test_a_builder_whose_session_starts_again_with_nothing_logged_is_told_so(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.expect_hook_allowed("s-1", HookSamples.session_start(), "task 1, Fix the cart, is in hand; nothing logged yet")

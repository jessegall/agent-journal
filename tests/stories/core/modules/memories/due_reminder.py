from datetime import timedelta

from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

EDIT = HookSamples.edit("src/cart.py")


def due_reminder(story) -> int:
    due = (story.clock.timestamp().value + timedelta(hours=1)).isoformat()
    return story.new_row_id(f'memory make "Deploy the cart at nine" --type reminder --due {due} --environment main', actor=story.agent)


def test_a_reminder_stays_quiet_until_its_due_time(new_story):
    story = new_story(fixture=BuilderStarted)
    due_reminder(story)
    story.tick("s-1")
    story.expect_hook_silent("s-1", EDIT)


def test_a_due_reminder_is_given_once_at_the_next_hook_after_the_tick_and_then_removed(new_story):
    story = new_story(fixture=BuilderStarted)
    memory_id = due_reminder(story)
    story.advance(timedelta(hours=2))
    story.tick("s-1")
    story.expect_hook_allowed("s-1", EDIT, "Deploy the cart at nine")
    story.expect_hook_silent("s-1", EDIT)
    story.run_listeners()
    story.expect_success(f"memory show {memory_id}", "state: removed")

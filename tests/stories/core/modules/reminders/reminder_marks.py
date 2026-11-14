from tests.stories.core.support.coding_fixtures import BuilderStarted

MARKS = "chat-mark list --environment 1"


def test_making_a_timed_reminder_shows_a_chat_mark_with_when_it_fires(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('reminder make "Look at the cart" --at 2030-01-01T10:00:00+00:00 --once --environment main', actor=story.agent)
    story.run_listeners()
    story.expect_text(MARKS, "Reminder set: Look at the cart", "Fires at 2030-01-01T10:00:00")


def test_a_repeating_reminder_says_how_often_it_fires(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('reminder make "Log the task" --every-minutes 10 --environment main', actor=story.agent)
    story.run_listeners()
    story.expect_text(MARKS, "Reminder set: Log the task", "Fires every 10 minutes")


def test_a_reminder_by_tool_uses_says_how_many(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('reminder make "Check in" --every-tool-uses 5 --environment main', actor=story.agent)
    story.run_listeners()
    story.expect_text(MARKS, "Fires every 5 tool uses")

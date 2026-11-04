from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from core.base.timestamp import Timestamp
from core.testing.expect_reply import expect_absent_reply_line, expect_reply_line
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderStarted

EDIT = HookSamples.edit("src/cart.py")
LISTING = HookSamples.shell("ls build", ShellPart("ls", CommandCategory.SEARCH, ["build"])).with_fields(event="post_tool_use")


def lines_of(story) -> list[str]:
    return list(story.hook("s-1", LISTING).lines)


def test_a_reminder_on_an_interval_of_time_comes_again_and_again(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('reminder make "Read the review" --every-minutes 10 --environment main', actor=story.agent)
    expect_absent_lines_of(story, "reminder:1: Read the review")
    story.advance(timedelta(minutes=11))
    expect_lines_of(story, "reminder:1: Read the review")
    expect_absent_lines_of(story, "reminder:1: Read the review")
    story.advance(timedelta(minutes=11))
    expect_lines_of(story, "reminder:1: Read the review")


def test_a_reminder_on_an_interval_of_tool_uses_comes_after_that_many(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('reminder make "Log the task" --every-tool-uses 1 --environment main', actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.hook("s-1", EDIT)
    story.advance(timedelta(seconds=1))
    story.hook("s-1", EDIT)
    story.expect_text("reminder show 1", "last_fired_at", actor=story.agent)


def test_a_reminder_at_a_date_comes_once_and_ends(new_story):
    story = new_story(fixture=BuilderStarted)
    later = Timestamp(story.clock.timestamp().value + timedelta(hours=1)).text
    story.expect_success(f'reminder make "Ship it" --at {later} --environment main', actor=story.agent)
    expect_absent_lines_of(story, "reminder:1: Ship it")
    story.advance(timedelta(hours=2))
    expect_lines_of(story, "reminder:1: Ship it")
    expect_absent_lines_of(story, "reminder:1: Ship it")


def test_a_once_reminder_on_an_interval_comes_one_time(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('reminder make "Stretch" --every-minutes 5 --once --environment main', actor=story.agent)
    story.advance(timedelta(minutes=6))
    expect_lines_of(story, "reminder:1: Stretch")
    story.advance(timedelta(minutes=6))
    expect_absent_lines_of(story, "reminder:1: Stretch")


def test_a_reminder_with_a_block_holds_the_agent_until_its_condition_comes_true(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    story.expect_success('reminder make "Close the task" --every-minutes 5 --once --block task-closed --block-subject 1 --environment main', actor=story.agent)
    story.advance(timedelta(minutes=6))
    lines_of(story)
    story.expect_hook_refusal("s-1", EDIT, "reminder:1 holds you: Close the task")
    story.run("task start 1", actor=story.agent)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_a_reminder_needs_a_time_or_an_interval_and_a_known_condition(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_refusal('reminder make "Nothing" --environment main', "a reminder needs a time or an interval", actor=story.agent)
    story.expect_refusal('reminder make "Nothing" --every-minutes 5 --block ghost --environment main', "no block condition is named ghost", actor=story.agent)


def expect_absent_lines_of(story, expected) -> None:
    expect_absent_reply_line(story.hook("s-1", LISTING), expected)


def expect_lines_of(story, expected) -> None:
    expect_reply_line(story.hook("s-1", LISTING), expected)

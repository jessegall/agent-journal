from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from engine.time.timestamp import Timestamp
from core.testing.expect_reply import expect_absent_reply_line, expect_reply_line
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderStarted

EDIT = HookSamples.edit("src/cart.py")
LISTING = HookSamples.shell("ls build", ShellPart("ls", CommandCategory.SEARCH, ["build"])).with_fields(event="post_tool_use")


def read_lines(story) -> list[str]:
    return list(story.hook("s-1", LISTING).lines)


def test_a_reminder_on_an_interval_of_time_comes_again_and_again(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('reminder make "Read the review" --every-minutes 10 --environment main', actor=story.agent)
    expect_absent_lines(story, "reminder:1 is due")
    story.advance(timedelta(minutes=11))
    expect_lines(story, "reminder:1 is due")
    story.expect_text("reminder show 1", "Read the review", actor=story.agent)
    expect_absent_lines(story, "reminder:1 is due")
    story.advance(timedelta(minutes=11))
    expect_lines(story, "reminder:1 is due")


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
    expect_absent_lines(story, "reminder:1 is due")
    story.advance(timedelta(hours=2))
    expect_lines(story, "reminder:1 is due")
    expect_absent_lines(story, "reminder:1 is due")


def test_a_once_reminder_on_an_interval_comes_one_time(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('reminder make "Stretch" --every-minutes 5 --once --environment main', actor=story.agent)
    story.advance(timedelta(minutes=6))
    expect_lines(story, "reminder:1 is due")
    story.advance(timedelta(minutes=6))
    expect_absent_lines(story, "reminder:1 is due")


def test_a_reminder_with_a_block_holds_the_agent_until_its_condition_comes_true(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    story.expect_success('reminder make "Close the task" --every-minutes 5 --once --block task-closed --block-subject 1 --environment main', actor=story.agent)
    story.advance(timedelta(minutes=6))
    read_lines(story)
    story.expect_hook_refusal("s-1", EDIT, "reminder:1 holds you")
    story.run("task start 1", actor=story.agent)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_a_reminder_needs_a_time_or_an_interval_and_a_known_condition(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_refusal('reminder make "Nothing" --environment main', "a reminder needs a time or an interval", actor=story.agent)
    story.expect_refusal('reminder make "Nothing" --every-minutes 5 --block ghost --environment main', "no block condition is named ghost", actor=story.agent)


def expect_absent_lines(story, expected) -> None:
    expect_absent_reply_line(story.hook("s-1", LISTING), expected)


def expect_lines(story, expected) -> None:
    expect_reply_line(story.hook("s-1", LISTING), expected)


def test_task_intervals_count_each_reminders_start_and_reset_after_firing(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('reminder make "Two tasks" --every-tasks 2 --environment main', actor=story.agent)
    story.advance(timedelta(seconds=1))
    close_task(story, "First task")
    story.advance(timedelta(seconds=1))
    story.expect_success('reminder make "One task" --every-tasks 1 --environment main', actor=story.agent)
    reply = story.hook("s-1", LISTING)
    expect_absent_reply_line(reply, "reminder:1 is due")
    expect_absent_reply_line(reply, "reminder:2 is due")
    story.advance(timedelta(seconds=1))
    close_task(story, "Second task")
    reply = story.hook("s-1", LISTING)
    expect_reply_line(reply, "reminders 1, 2 are due")
    close_task(story, "Task at the firing timestamp")
    reply = story.hook("s-1", LISTING)
    expect_absent_reply_line(reply, "reminder:1 is due")
    expect_absent_reply_line(reply, "reminder:2 is due")
    story.advance(timedelta(seconds=1))
    close_task(story, "Third task")
    reply = story.hook("s-1", LISTING)
    expect_absent_reply_line(reply, "reminder:1 is due")
    expect_reply_line(reply, "reminder:2 is due")


def close_task(story, title: str) -> None:
    task_id = story.new_row_id(f'task make "{title}" --environment main', actor=story.agent)
    story.expect_success(f"task start {task_id}", actor=story.agent)
    story.expect_success(f'task close {task_id} --outcome "Complete"', actor=story.agent)

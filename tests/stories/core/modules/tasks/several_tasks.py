import pytest

from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.helper_started import HelperStarted
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder
from engine.testing.expectations.expect_reply import expect_reply_line
from core.modules.tasks.support.task_nudges import TASK_RETURN
from engine.testing.expectations.expect_nudge import said
def posted(line):
    sample = HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:], subcommand=line.split()[1]))
    return sample.with_fields(event="post_tool_use", raw={"tool_input": {"command": line}})


def three_started_tasks(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.expect_success('task make "Second" --environment main', actor=story.agent)
    story.expect_success('task make "Third" --environment main', actor=story.agent)
    story.expect_success('task make "Waiting" --environment main', actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_success("task start 3", actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_success("task start 2", actor=story.agent)
    return story


def test_the_newest_started_task_is_the_current_one_whatever_its_number(started_tasks):
    story = started_tasks
    story.expect_hook_allowed("s-1", HookSamples.session_start(), "task:2 is in hand")


def test_after_a_close_the_newest_started_still_held_is_named_and_nothing_new_starts(started_tasks):
    story = started_tasks
    story.expect_success("task close 2 --outcome done", actor=story.agent)
    story.run_listeners()
    lines = story.hook("s-1", posted("journal task close 2 --outcome done"))
    expect_reply_line(lines, said(TASK_RETURN, task=3))
    story.expect_success("task show 4", "state: open", actor=story.agent)


def test_focusing_an_earlier_started_task_makes_it_the_task_in_hand_until_another_task_is_started(started_tasks):
    story = started_tasks
    story.advance(timedelta(seconds=1))
    story.expect_success("task focus 3", "you work on task 3 now: Third", "also started: task 2, Second", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.session_start(), "task:3 is in hand")
    story.advance(timedelta(seconds=1))
    story.expect_success("task start 4", actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_success("task focus 3", "you work on task 3 now: Third", "also started: task 4, Waiting", actor=story.agent)
    story.expect_success("task focus --clear", "the task you work on is the one you started last again", "you work on task 4 now: Waiting", actor=story.agent)


def test_closing_the_focused_task_goes_back_to_the_task_started_last(started_tasks):
    story = started_tasks
    story.advance(timedelta(seconds=1))
    story.run("task focus 1", actor=story.agent)
    story.expect_success("task close 1 --outcome done", actor=story.agent)
    story.run_listeners()
    expect_reply_line(story.hook("s-1", posted("journal task close 1 --outcome done")), said(TASK_RETURN, task=2))


def test_a_task_that_is_open_or_is_no_task_cannot_be_focused(started_tasks):
    story = started_tasks
    story.expect_refusal("task focus 4", "task 4 is open: only a started task is worked on now", actor=story.agent)
    story.expect_refusal("task focus 99", "no such task", actor=story.agent)


def test_a_task_another_agent_started_cannot_be_focused(new_story):
    story = new_story(fixture=HelperStarted)
    story.run('task make "The count" --environment main', actor=story.helper)
    story.run("task start 1", actor=story.helper)
    story.expect_refusal("task focus 1", "task 1 is started by another agent", actor=story.agent)
    story.expect_success("task focus", "you work on task 1 now: The count", actor=story.helper)


@pytest.fixture
def started_tasks(new_story):
    return three_started_tasks(new_story)

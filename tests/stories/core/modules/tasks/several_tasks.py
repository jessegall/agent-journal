import pytest

from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder
from engine.testing.expectations.expect_reply import expect_reply_line
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
    expect_reply_line(lines, "back to task:3")
    story.expect_success("task show 4", "state: open", actor=story.agent)


@pytest.fixture
def started_tasks(new_story):
    return three_started_tasks(new_story)

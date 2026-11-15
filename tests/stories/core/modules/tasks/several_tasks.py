from engine.enums.actor_type import ActorType
from engine.actor.actor import Actor
import pytest

from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.helper_started import HelperStarted
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder
from core.modules.tasks.nudges.current_task_message import CurrentTaskMessage
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
    story.expect_hook_allowed("s-1", HookSamples.session_start(), CurrentTaskMessage.declared().nudge(task=2).text)


def test_focusing_an_earlier_started_task_makes_it_the_task_in_hand_until_another_task_is_started(started_tasks):
    story = started_tasks
    story.advance(timedelta(seconds=1))
    story.expect_success("task focus 3", "you work on task 3 now: Third", "also started: task 2, Second", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.session_start(), CurrentTaskMessage.declared().nudge(task=3).text)
    story.advance(timedelta(seconds=1))
    story.expect_success("task start 4", actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_success("task focus 3", "you work on task 3 now: Third", "also started: task 4, Waiting", actor=story.agent)
    story.expect_success("task focus --clear", "the task you work on is the one you started last again", "you work on task 4 now: Waiting", actor=story.agent)


def test_a_task_that_is_open_or_is_no_task_cannot_be_focused(started_tasks):
    story = started_tasks
    story.expect_refusal("task focus 4", "task 4 is open: only a started task is worked on now", actor=story.agent)
    story.expect_refusal("task focus 99", "no such task", actor=story.agent)


def test_a_task_another_agent_started_cannot_be_focused(new_story):
    story = new_story(fixture=HelperStarted)
    worker = Actor(story.new_row_id("agent start s-worker claude worker --environment main"), ActorType.AGENT)
    story.run('task make "The count" --environment main', actor=worker)
    story.run("task start 1", actor=worker)
    story.expect_refusal("task focus 1", "task 1 is started by another agent", actor=story.agent)
    story.expect_success("task focus", "you work on task 1 now: The count", actor=worker)


@pytest.fixture
def started_tasks(new_story):
    return three_started_tasks(new_story)

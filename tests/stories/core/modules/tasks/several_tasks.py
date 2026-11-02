from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask


def posted(line):
    sample = HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:], subcommand=line.split()[1]))
    return sample.with_fields(event="post_tool_use", raw={"tool_input": {"command": line}})


def three_started_tasks(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.expect_success('task make "Second" --environment main', actor=story.agent)
    story.expect_success('task make "Third" --environment main', actor=story.agent)
    story.expect_success('task make "Waiting" --environment main', actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_success("task start 3", actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_success("task start 2", actor=story.agent)
    return story


def test_the_newest_started_task_is_the_current_one_whatever_its_number(new_story):
    story = three_started_tasks(new_story)
    assert any("task:2 is in hand" in line for line in story.hook("s-1", HookSamples.session_start()).lines)


def test_after_a_close_the_newest_started_still_held_is_named_and_nothing_new_starts(new_story):
    story = three_started_tasks(new_story)
    story.expect_success("task close 2 --outcome done", actor=story.agent)
    story.run_listeners()
    lines = story.hook("s-1", posted("journal task close 2 --outcome done")).lines
    assert any("back to task:3" in line for line in lines)
    story.expect_success("task show 4", "state: open", actor=story.agent)


def test_with_empty_hands_nothing_is_named_and_the_next_task_starts(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.expect_success('task make "Next" --environment main', actor=story.agent)
    story.expect_success("task close 1 --outcome done", actor=story.agent)
    story.run_listeners()
    story.expect_success("task show 2", "state: started", actor=story.agent)


def test_a_stop_names_every_task_in_hand_at_once_newest_first(new_story):
    story = three_started_tasks(new_story)
    refusal = story.hook("s-1", HookSamples.stop()).refusal
    assert "task:2, task:3, task:1" in refusal
    assert "close, release or block each" in refusal

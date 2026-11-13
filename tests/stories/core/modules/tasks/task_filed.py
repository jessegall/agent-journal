from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.modules.tasks.support.task_nudges import TASK_FILED
from core.modules.tasks.support.task_nudges import TASK_FILED_KEEP_CURRENT
from engine.testing.expectations.said_nudge import said

TASK_MADE = HookSamples.shell('journal task make "Fix the cart"', ShellPart("journal", CommandCategory.JOURNAL, ["task", "make", "Fix the cart"])).with_fields(event="post_tool_use")
TASK_LISTED = HookSamples.shell("journal task list", ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"])).with_fields(event="post_tool_use")


def test_making_a_task_with_none_in_hand_says_the_assigner_hands_it_out(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_allowed("s-1", TASK_MADE, said(TASK_FILED))


def test_making_a_task_with_one_in_hand_says_to_carry_on_with_that_one(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the total" --environment main', actor=story.agent)
    story.run("task start 1", actor=story.agent)
    story.expect_hook_allowed("s-1", TASK_MADE, said(TASK_FILED_KEEP_CURRENT, task=1))

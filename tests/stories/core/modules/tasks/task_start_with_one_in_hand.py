from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderStarted

STARTING_TWO = HookSamples.shell("journal task start 2", ShellPart("journal", CommandCategory.JOURNAL, ["task", "start", "2"]))
STARTING_ONE = HookSamples.shell("journal task start 1", ShellPart("journal", CommandCategory.JOURNAL, ["task", "start", "1"]))


def made(story):
    story.run('task make "Fix the total" --environment main', actor=story.agent)
    story.run('task make "Fix the tax" --environment main', actor=story.agent)


def test_starting_a_task_with_another_in_hand_asks_about_testing_that_one(new_story):
    story = new_story(fixture=BuilderStarted)
    made(story)
    story.run("task start 1", actor=story.agent)
    story.expect_hook_allowed("s-1", STARTING_TWO, "did you mean to move task:1 to testing first? journal task test 1")


def test_starting_a_task_with_none_in_hand_says_nothing(new_story):
    story = new_story(fixture=BuilderStarted)
    made(story)
    story.expect_absent_hook_line("s-1", STARTING_ONE, "to testing first")

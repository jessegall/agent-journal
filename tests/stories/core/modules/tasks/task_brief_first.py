from core.base.driver.command_category import CommandCategory
from core.modules.tasks.support.task_brief_requirement import TaskBriefRequirement
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderStarted, BuilderWithReadTask, BuilderWithUnreadTask, BuilderWithBriefedTask

EDIT = HookSamples.edit("src/cart.py")
BRIEF_LINE = HookSamples.shell("journal task brief 1", ShellPart("journal", CommandCategory.JOURNAL, ["task", "brief", "1"], subcommand="task"))
COMPACTION = HookSamples.sample("compact")
BRIEF_REFUSAL = "journal task brief 1"


def briefs_required(story) -> None:
    story.container.get(TaskBriefRequirement).is_required = True


def test_the_brief_command_prints_the_title_the_brief_and_the_comments(new_story):
    story = new_story(fixture=BuilderWithBriefedTask)
    story.run('task comment 1 "use the new cart" --environment main', actor=story.user)
    story.expect_text("task brief 1", "task 1: Fix the cart", "the total is in cents", "use the new cart", actor=story.agent)


def test_the_brief_command_says_when_a_task_has_no_comments(new_story):
    story = new_story(fixture=BuilderWithBriefedTask)
    story.expect_text("task brief 1", "no comments on task 1", actor=story.agent)


def test_a_task_handed_to_an_agent_blocks_it_until_it_read_the_brief(new_story):
    story = new_story(fixture=BuilderWithUnreadTask)
    story.expect_hook_refusal("s-1", EDIT, BRIEF_REFUSAL)
    story.expect_hook_allowed("s-1", BRIEF_LINE)


def test_running_the_brief_command_releases_the_block(new_story):
    story = new_story(fixture=BuilderWithUnreadTask)
    story.expect_text("task brief 1", "task 1: Fix the cart", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_two_unread_tasks_hold_two_blocks_so_reading_one_leaves_the_other(new_story):
    story = new_story(fixture=BuilderWithUnreadTask)
    story.run('task make "Second" --brief "A second job" --environment main', actor=story.user)
    story.run("task start 2", actor=story.agent)
    story.run("task brief 2", actor=story.agent)
    story.expect_hook_refusal("s-1", EDIT, BRIEF_REFUSAL)
    story.run("task brief 1", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_a_task_already_read_in_this_window_raises_no_block(new_story):
    story = new_story(fixture=BuilderWithReadTask)
    briefs_required(story)
    story.run('task release 1 --reason "later"', actor=story.agent)
    story.run("task start 1", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_a_compaction_blocks_the_agent_again_until_it_reads_the_brief(new_story):
    story = new_story(fixture=BuilderWithReadTask)
    briefs_required(story)
    story.hook("s-1", COMPACTION)
    story.expect_hook_refusal("s-1", EDIT, BRIEF_REFUSAL)
    story.run("task brief 1", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_a_task_started_by_a_person_blocks_no_agent(new_story):
    story = new_story(fixture=BuilderWithBriefedTask)
    briefs_required(story)
    story.run("task start 1", actor=story.user)
    story.expect_hook_allowed("s-1", EDIT)


def test_a_story_that_is_not_about_the_brief_is_not_blocked(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    story.run("task start 1", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)

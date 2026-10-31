from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.skills.agent_skills import read_of
from tests.stories.core.modules.skills.due import JOURNAL_TASK_LIST, environment, start

EDIT = HookSamples.edit("src/cart.py")
JOURNAL_AGENT_LIST = HookSamples.shell("journal agent list", ShellPart("journal", CommandCategory.JOURNAL, ["agent", "list"]))


def notes_due(new_story):
    story = environment(new_story)
    story.run("setting make skills.session-start '[\"journal-notes\"]'")
    start(story)
    return story


def skill_path(story, skill: str) -> str:
    return str(story.home.project_folder / ".claude/skills" / skill / "SKILL.md")


def test_with_a_skill_due_every_tool_but_a_read_of_it_is_refused_with_its_path(new_story):
    story = notes_due(new_story)
    story.expect_hook_refusal("s-1", EDIT, f"read journal-notes first: {skill_path(story, 'journal-notes')}")


def test_a_journal_command_passes_while_a_skill_is_due(new_story):
    story = notes_due(new_story)
    story.expect_hook_allowed("s-1", JOURNAL_AGENT_LIST)


def test_a_read_of_the_due_skill_passes_and_the_next_tool_is_not_refused(new_story):
    story = notes_due(new_story)
    read_of(story, ".claude/skills/journal-notes/SKILL.md")
    story.expect_hook_allowed("s-1", EDIT)


def test_a_stop_is_refused_naming_the_unread_skills(new_story):
    story = notes_due(new_story)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "unread skills: journal-notes")


def test_a_journal_command_of_a_noun_whose_skill_is_unread_is_refused_until_it_is_read(new_story):
    story = notes_due(new_story)
    story.expect_hook_refusal("s-1", JOURNAL_TASK_LIST, f"read journal-tasks first: {skill_path(story, 'journal-tasks')}")
    read_of(story, ".claude/skills/journal-notes/SKILL.md")
    story.expect_hook_refusal("s-1", JOURNAL_TASK_LIST, "read journal-tasks first")
    read_of(story, ".claude/skills/journal-tasks/SKILL.md")
    story.expect_hook_allowed("s-1", JOURNAL_TASK_LIST)


def test_with_nothing_due_nothing_is_refused(new_story):
    story = environment(new_story)
    story.run("setting make skills.session-start '[]'")
    start(story)
    story.expect_hook_allowed("s-1", EDIT)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_a_silenced_rule_refuses_nothing_while_the_agent_waits(new_story):
    story = notes_due(new_story)
    story.run("task make \"The review\" --environment main")
    story.run("wait on 'the review' --target tasks:1", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)

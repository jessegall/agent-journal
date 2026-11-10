import pytest

from engine.driver.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.modules.skills.agent_skills import read_row
from tests.stories.engine.driver.support.fixtures import LeadStarted
from tests.stories.engine.driver.support.samples import SAMPLES
from tests.stories.core.modules.skills.due import DUE, JOURNAL_TASK_LIST, environment, expect_countdown, start, drain_countdown, start_countdown
from tests.stories.support.story_checks import expect_value

EDIT = HookSamples.edit("src/cart.py")
JOURNAL_AGENT_LIST = HookSamples.shell("journal agent list", ShellPart("journal", CommandCategory.JOURNAL, ["agent", "list"]))


def notes_due(new_story):
    story = environment(new_story)
    story.run("setting make journal.core.skills.session-start '[\"journal-notes\"]'")
    start(story)
    return story


def exhausted(story) -> None:
    drain_countdown(story, EDIT, "journal-notes")


def test_reading_the_due_skill_during_the_countdown_ends_it(due_notes):
    story = due_notes
    start_countdown(story, EDIT)
    expect_countdown(story, EDIT, "journal-notes", 2)
    read_row(story, ".claude/skills/journal-notes/SKILL.md")
    for _ in range(4):
        story.expect_hook_allowed("s-1", EDIT)
    expect_value("load skill" not in story.hook("s-1", EDIT).lines, True)


def test_each_part_of_a_shell_line_that_reads_a_skill_loads_that_skill_at_once(exhausted_notes):
    story = install_runner(exhausted_notes)
    story.run("setting make journal.core.skills.session-start '[\"journal-notes\", \"journal-tasks\"]'")
    line = "sed -n 1,240p .claude/skills/journal-notes/SKILL.md && sed -n 1,240p .claude/skills/journal-tasks/SKILL.md && ls src"
    parts = (ShellPart("sed", CommandCategory.READ, ["-n", "1,240p", ".claude/skills/journal-notes/SKILL.md"]), ShellPart("sed", CommandCategory.READ, ["-n", "1,240p", ".claude/skills/journal-tasks/SKILL.md"]), ShellPart("ls", CommandCategory.READ, ["src"]))
    story.hook("s-1", HookSamples.shell(line, *parts))
    story.expect_hook_allowed("s-1", EDIT)
    story.expect_hook_allowed("s-1", JOURNAL_TASK_LIST)


def test_a_block_names_the_next_due_skill_once_the_first_is_read(exhausted_notes):
    story = exhausted_notes
    story.expect_hook_refusal("s-1", EDIT, "load this first with the Skill tool: journal-notes")
    read_row(story, ".claude/skills/journal-notes/SKILL.md")
    story.expect_hook_allowed("s-1", EDIT)


def test_a_stop_is_refused_naming_the_unread_skills(due_notes):
    story = due_notes
    story.expect_hook_refusal("s-1", HookSamples.stop(), "unread skills: journal-notes")


def test_a_journal_command_of_a_noun_whose_skill_is_unread_is_refused_until_it_is_read(due_notes):
    story = due_notes
    read_row(story, ".claude/skills/journal-notes/SKILL.md")
    drain_countdown(story, JOURNAL_TASK_LIST, "journal-tasks")
    story.expect_hook_refusal("s-1", JOURNAL_TASK_LIST, "load this first with the Skill tool: journal-tasks")
    read_row(story, ".claude/skills/journal-tasks/SKILL.md")
    story.expect_hook_allowed("s-1", JOURNAL_TASK_LIST)


def test_with_nothing_due_nothing_is_refused(new_story):
    story = environment(new_story)
    story.run("setting make journal.core.skills.session-start '[]'")
    start(story)
    story.expect_hook_allowed("s-1", EDIT)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_a_silenced_rule_refuses_nothing_while_the_agent_waits(new_story):
    story = new_story(SAMPLES, DUE, fixture=LeadStarted)
    story.run("task make \"The review\" --environment main")
    story.run("wait on 'the review' --target tasks:1", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.stop())


@pytest.fixture
def due_notes(new_story):
    return notes_due(new_story)


@pytest.fixture
def exhausted_notes(due_notes):
    exhausted(due_notes)
    return due_notes

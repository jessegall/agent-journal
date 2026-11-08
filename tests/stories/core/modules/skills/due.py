from datetime import timedelta

import pytest

from core.base.command.bus import Bus
from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from core.modules.skills.support.skill_requirement import SkillRequirement
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.modules.skills.support.skill_samples import PATH
from tests.stories.core.support.coding_fixtures import CodingEnvironment
from tests.stories.support.story_checks import expect_value_with, expect_value_without

DUE = f"{PATH}:DueSkillsModule"
JOURNAL_TASK_LIST = HookSamples.shell("journal task list", ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"]))
MEMORY_LIST = HookSamples.shell("journal memory list", ShellPart("journal", CommandCategory.JOURNAL, ["memory", "list"], subcommand="memory"))
DEFAULTS = ("journal", "journal-etiquette")


def environment(new_story):
    story = new_story(DUE, fixture=CodingEnvironment)
    story.container.bind(SkillRequirement, SkillRequirement())
    story.run("skill write")
    return story


def start(story, sample=None) -> None:
    story.agent = hook_agent(story, story.hook("s-1", sample or HookSamples.session_start()))
    story.run_listeners()


def due_lines(story) -> str:
    return story.run(f"agent-skill list --agent {story.agent.id}").output_text


def expect_due(story, *folders: str) -> None:
    text = due_lines(story)
    assert all(f"  {folder}  due" in text for folder in folders), text


def expect_skills_absent(story, *folders: str) -> None:
    text = due_lines(story)
    assert not any(f"  {folder}  due" in text for folder in folders), text


def expect_countdown(story, sample, skill: str, remaining: int) -> None:
    story.advance(timedelta(seconds=1))
    reply = story.hook("s-1", sample)
    line = f"load skill {skill} due: {remaining} tool uses"
    assert line in reply.lines and not reply.refusal, f"{line!r} not in {reply.lines!r}, refusal {reply.refusal!r}"


def use_up_countdown(story, sample, skill: str) -> None:
    """Three tool uses pass with the skill named and the count going down; the fourth is the one that is held."""
    for remaining in (3, 2, 1):
        expect_countdown(story, sample, skill, remaining)


def digest_of(story, skill: str) -> str:
    return next(entry.digest for entry in Registry.read(story.container.get(Database)).skills if entry.folder == skill)


def test_a_session_start_makes_due_the_skills_of_the_session_start_setting_which_default_to_the_three(started_skill_environment):
    story = started_skill_environment
    skill_lines = due_lines(story)
    expect_defaults(skill_lines, DEFAULTS)
    expect_journal_notes_chores(skill_lines, "journal-notes", "journal-chores")


def test_the_session_start_setting_names_the_skills_instead(skill_environment):
    story = skill_environment
    story.run("setting make journal.core.skills.session-start '[\"journal-notes\"]'")
    start(story)
    expect_due(story, "journal-notes")
    expect_skills_absent(story, *DEFAULTS)


def test_a_start_after_a_compaction_makes_due_the_skills_of_the_after_compaction_setting(compacted_environment):
    story = compacted_environment
    expect_due(story, "journal-chores")


def test_after_a_compaction_the_due_skill_is_named_for_three_tool_uses_and_then_held_until_it_is_loaded(compacted_environment):
    story = compacted_environment
    use_up_countdown(story, HookSamples.edit("src/cart.py"), "journal")
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "load this first with the Skill tool: journal")
    for skill in (*DEFAULTS, "journal-chores"):
        story.container.get(Bus).run(LoadSkill(story.agent.id, skill, digest_of(story, skill)), story.agent)
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))


def test_a_prompt_of_the_user_holding_a_keyword_makes_the_skill_due(prompt_skill_due):
    story = prompt_skill_due
    expect_due(story, "journal-notes")


def test_a_journal_line_a_plugins_notice_or_a_helpers_notice_makes_nothing_due(started_skill_environment):
    story = started_skill_environment
    for text in ("[journal] take a note of that", "[plugin:ledger] take a note of that"):
        story.hook("s-1", HookSamples.prompt(text))
    story.hook("a-1", HookSamples.prompt("take a note of that"))
    story.run_listeners()
    expect_skills_absent(story, "journal-notes")


def test_a_journal_command_of_a_noun_a_skill_covers_names_the_skill_for_three_tool_uses_and_is_then_refused_until_the_skill_is_read(started_skill_environment):
    story = started_skill_environment
    use_up_countdown(story, JOURNAL_TASK_LIST, "journal-tasks")
    story.expect_hook_refusal("s-1", JOURNAL_TASK_LIST, "load this first with the Skill tool: journal-tasks")


def test_loading_the_skill_during_the_countdown_ends_it(defaults_loaded):
    story = defaults_loaded
    expect_countdown(story, MEMORY_LIST, "journal-memory", 3)
    expect_countdown(story, MEMORY_LIST, "journal-memory", 2)
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-memory", digest_of(story, "journal-memory")), story.agent)
    for _ in range(4):
        story.expect_hook_allowed("s-1", MEMORY_LIST)
    assert "load skill" not in story.hook("s-1", MEMORY_LIST).lines


def test_a_block_raised_again_for_another_skill_waits_for_the_skill_its_text_names(tasks_held):
    story = tasks_held
    story.expect_hook_refusal("s-1", JOURNAL_TASK_LIST, "load this first with the Skill tool: journal-tasks")
    use_up_countdown(story, MEMORY_LIST, "journal-memory")
    story.expect_hook_refusal("s-1", MEMORY_LIST, "load this first with the Skill tool: journal-memory")
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-tasks", digest_of(story, "journal-tasks")), story.agent)
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "load this first with the Skill tool: journal-memory")
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-memory", digest_of(story, "journal-memory")), story.agent)
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))


def test_a_refused_command_blocks_every_other_tool_but_reading_until_its_skill_is_read(tasks_held):
    story = tasks_held
    story.expect_hook_refusal("s-1", JOURNAL_TASK_LIST, "load this first with the Skill tool: journal-tasks")
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "load this first with the Skill tool: journal-tasks")
    story.expect_hook_allowed("s-1", HookSamples.shell("cat src/cart.py", ShellPart("cat", CommandCategory.READ, ["src/cart.py"])))
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-tasks", digest_of(story, "journal-tasks")), story.agent)
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))


def test_an_event_a_skill_names_makes_it_due_for_the_main_agent_of_the_environment(task_skill_due):
    story = task_skill_due
    expect_due(story, "journal-chores")


def test_an_event_a_skill_names_makes_it_due_unless_the_agent_read_it(task_skill_loaded):
    story = task_skill_loaded
    expect_skills_absent(story, "journal-chores")


def test_a_skill_already_loaded_at_the_same_digest_is_never_due(prompt_skill_loaded):
    story = prompt_skill_loaded
    skill_lines = due_lines(story)
    expect_value_without(skill_lines, "  journal-notes  due")
    expect_value_with(skill_lines, f"journal-notes  {digest_of(story, 'journal-notes')}  loaded")


@pytest.fixture
def skill_environment(new_story):
    return environment(new_story)


@pytest.fixture
def started_skill_environment(skill_environment):
    story = skill_environment
    start(story)
    return story


@pytest.fixture
def compacted_environment(skill_environment):
    story = skill_environment
    story.run("setting make journal.core.skills.after-compaction '[\"journal-chores\"]'")
    start(story)
    story.hook("s-1", HookSamples.sample("compact"))
    story.hook("s-1", HookSamples.session_start())
    story.run_listeners()
    return story


@pytest.fixture
def defaults_loaded(started_skill_environment):
    story = started_skill_environment
    for skill in DEFAULTS:
        story.container.get(Bus).run(LoadSkill(story.agent.id, skill, digest_of(story, skill)), story.agent)
    return story


@pytest.fixture
def tasks_held(defaults_loaded):
    use_up_countdown(defaults_loaded, JOURNAL_TASK_LIST, "journal-tasks")
    return defaults_loaded


@pytest.fixture
def prompt_skill_due(started_skill_environment):
    story = started_skill_environment
    story.hook("s-1", HookSamples.prompt("please take a note of that"))
    story.run_listeners()
    return story


@pytest.fixture
def prompt_skill_loaded(started_skill_environment):
    story = started_skill_environment
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-notes", digest_of(story, "journal-notes")), story.agent)
    story.hook("s-1", HookSamples.prompt("please take a note of that"))
    story.run_listeners()
    return story


@pytest.fixture
def task_skill_due(started_skill_environment):
    story = started_skill_environment
    story.run(f'task make "Fix the cart" --environment main')
    story.run("task start 1 --environment main", actor=story.agent)
    story.run_listeners()
    return story


@pytest.fixture
def task_skill_loaded(started_skill_environment):
    story = started_skill_environment
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-chores", digest_of(story, "journal-chores")), story.agent)
    story.run('task make "Fix the cart" --environment main')
    story.run("task start 1 --environment main", actor=story.agent)
    story.run_listeners()
    return story


def expect_journal_notes_chores(skill_lines, text, text_2) -> None:
    actual = all((f'  {folder}  due' not in skill_lines for folder in (text, text_2)))
    assert actual, actual


def expect_defaults(skill_lines, item) -> None:
    actual = all((f'  {folder}  due' in skill_lines for folder in item))
    assert actual, actual

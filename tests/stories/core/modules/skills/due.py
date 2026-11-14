from datetime import timedelta

import pytest

from engine.command.bus import Bus
from engine.database.database import Database
from engine.registry.registry import Registry
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from core.modules.skills.support.skill_requirement import SkillRequirement
from tests.stories.engine.driver.support.hook_agents import hook_agent
from tests.stories.core.modules.skills.support.skill_samples import PATH
from tests.stories.core.support.coding_fixtures import CodingEnvironment
from tests.stories.support.story_checks import expect_value, expect_value_with, expect_value_without
from core.modules.skills.support.start_skills import AFTER_COMPACTION_KEY
from core.modules.skills.support.start_skills import SESSION_START_KEY

DUE = f"{PATH}:DueSkillsModule"
JOURNAL_TASK_LIST = HookSamples.shell("journal task list", ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"]))
RULE_LIST = HookSamples.shell("journal rule list", ShellPart("journal", CommandCategory.JOURNAL, ["rule", "list"], subcommand="rule"))
DEFAULTS = ("journal", "journal-memory", "journal-etiquette")


def environment(new_story):
    story = new_story(DUE, fixture=CodingEnvironment)
    story.replace(SkillRequirement, SkillRequirement())
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


def expect_countdown(story, sample, skill: str, remaining: int, session: str = "s-1") -> None:
    story.run_listeners()
    story.advance(timedelta(seconds=1))
    reply = story.hook(session, sample)
    line = f"load skill {skill} due: {remaining} tool uses"
    assert line in reply.lines and not reply.refusal, f"{line!r} not in {reply.lines!r}, refusal {reply.refusal!r}"


def start_countdown(story, sample, session: str = "s-1") -> None:
    story.hook(session, sample)


def drain_countdown(story, sample, skill: str, session: str = "s-1") -> None:
    start_countdown(story, sample, session)
    for remaining in (2, 1, 0):
        expect_countdown(story, sample, skill, remaining, session)


def read_digest(story, skill: str) -> str:
    return next(entry.digest for entry in Registry.read(story.container.get(Database)).skills if entry.folder == skill)


def test_the_session_start_setting_names_the_skills_instead(skill_environment):
    story = skill_environment
    story.run(f"setting make {SESSION_START_KEY} '[\"journal-notes\"]'")
    start(story)
    expect_due(story, "journal-notes")
    expect_skills_absent(story, *DEFAULTS)


def test_after_a_compaction_the_due_skill_is_named_for_three_tool_uses_and_then_held_until_it_is_loaded(compacted_environment):
    story = compacted_environment
    drain_countdown(story, HookSamples.edit("src/cart.py"), "journal")
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "load this first with the Skill tool: journal")
    for skill in (*DEFAULTS, "journal-chores"):
        story.container.get(Bus).run(LoadSkill(story.agent.id, skill, read_digest(story, skill)), story.agent)
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
    drain_countdown(story, JOURNAL_TASK_LIST, "journal-tasks")
    story.expect_hook_refusal("s-1", JOURNAL_TASK_LIST, "load this first with the Skill tool: journal-tasks")


def test_a_phrase_trigger_names_its_skill_for_three_tool_uses_and_then_holds_until_it_is_loaded(defaults_loaded):
    story = defaults_loaded
    story.expect_success('trigger make "deploy" "read it" --do skill --skill journal-rules', actor=story.user)
    drain_countdown(story, HookSamples.edit("deploy/cart.py"), "journal-rules")
    story.expect_hook_refusal("s-1", HookSamples.edit("deploy/cart.py"), "load this first with the Skill tool: journal-rules")


def test_loading_the_skill_during_the_countdown_ends_it(defaults_loaded):
    story = defaults_loaded
    start_countdown(story, RULE_LIST)
    expect_countdown(story, RULE_LIST, "journal-rules", 2)
    expect_countdown(story, RULE_LIST, "journal-rules", 1)
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-rules", read_digest(story, "journal-rules")), story.agent)
    for _ in range(4):
        story.expect_hook_allowed("s-1", RULE_LIST)
    expect_value("load skill" not in story.hook("s-1", RULE_LIST).lines, True)


def test_a_block_raised_again_for_another_skill_waits_for_the_skill_its_text_names(started_tasks):
    story = started_tasks
    story.expect_hook_refusal("s-1", JOURNAL_TASK_LIST, "load this first with the Skill tool: journal-tasks")
    story.expect_hook_refusal("s-1", RULE_LIST, "load this first with the Skill tool: journal-tasks")
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-tasks", read_digest(story, "journal-tasks")), story.agent)
    drain_countdown(story, RULE_LIST, "journal-rules")
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "load this first with the Skill tool: journal-rules")
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-rules", read_digest(story, "journal-rules")), story.agent)
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))


def test_a_refused_command_blocks_every_other_tool_until_its_skill_is_read(started_tasks):
    story = started_tasks
    story.expect_hook_refusal("s-1", JOURNAL_TASK_LIST, "load this first with the Skill tool: journal-tasks")
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "load this first with the Skill tool: journal-tasks")
    story.expect_hook_refusal("s-1", HookSamples.shell("cat src/cart.py", ShellPart("cat", CommandCategory.READ, ["src/cart.py"])), "load this first with the Skill tool: journal-tasks")
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-tasks", read_digest(story, "journal-tasks")), story.agent)
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))


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
    story.run(f"setting make {AFTER_COMPACTION_KEY} '[\"journal-chores\"]'")
    start(story)
    story.hook("s-1", HookSamples.sample("compact"))
    story.hook("s-1", HookSamples.session_start())
    story.run_listeners()
    return story


@pytest.fixture
def defaults_loaded(started_skill_environment):
    story = started_skill_environment
    for skill in DEFAULTS:
        story.container.get(Bus).run(LoadSkill(story.agent.id, skill, read_digest(story, skill)), story.agent)
    return story


@pytest.fixture
def started_tasks(defaults_loaded):
    drain_countdown(defaults_loaded, JOURNAL_TASK_LIST, "journal-tasks")
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
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-notes", read_digest(story, "journal-notes")), story.agent)
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
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-chores", read_digest(story, "journal-chores")), story.agent)
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

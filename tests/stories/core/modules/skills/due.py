from core.base.command.bus import Bus
from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.modules.skills.commands.load_skill import LoadSkill
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.modules.skills.support.skill_samples import PATH
from tests.stories.core.support.coding_fixtures import CodingEnvironment

DUE = f"{PATH}:DueSkillsModule"
JOURNAL_TASK_LIST = HookSamples.shell("journal task list", ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"]))
DEFAULTS = ("journal", "journal-etiquette", "journal-messages")


def environment(new_story):
    story = new_story(DUE, fixture=CodingEnvironment)
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


def expect_not_due(story, *folders: str) -> None:
    text = due_lines(story)
    assert not any(f"  {folder}  due" in text for folder in folders), text


def digest_of(story, skill: str) -> str:
    return next(entry.digest for entry in Registry.read(story.container.get(Database)).skills if entry.folder == skill)


def test_a_session_start_makes_due_the_skills_of_the_session_start_setting_which_default_to_the_three(new_story):
    story = environment(new_story)
    start(story)
    expect_due(story, *DEFAULTS)
    expect_not_due(story, "journal-notes", "journal-tasks")


def test_the_session_start_setting_names_the_skills_instead(new_story):
    story = environment(new_story)
    story.run("setting make skills.session-start '[\"journal-notes\"]'")
    start(story)
    expect_due(story, "journal-notes")
    expect_not_due(story, *DEFAULTS)


def test_a_start_after_a_compaction_makes_due_the_skills_of_the_after_compaction_setting(new_story):
    story = environment(new_story)
    story.run("setting make skills.after-compaction '[\"journal-tasks\"]'")
    start(story)
    story.hook("s-1", HookSamples.sample("compact"))
    story.hook("s-1", HookSamples.session_start())
    story.run_listeners()
    expect_due(story, "journal-tasks")


def test_a_prompt_of_the_user_holding_a_keyword_makes_the_skill_due(new_story):
    story = environment(new_story)
    start(story)
    story.hook("s-1", HookSamples.prompt("please take a note of that"))
    story.run_listeners()
    expect_due(story, "journal-notes")


def test_a_journal_line_a_plugins_notice_or_a_subagents_notice_makes_nothing_due(new_story):
    story = environment(new_story)
    start(story)
    for text in ("[journal] take a note of that", "[plugin:ledger] take a note of that"):
        story.hook("s-1", HookSamples.prompt(text))
    story.hook("s-1", HookSamples.prompt("take a note of that").with_fields(subagent="a-1"))
    story.run_listeners()
    expect_not_due(story, "journal-notes")


def test_a_journal_command_of_a_noun_a_skill_covers_makes_it_due_until_read(new_story):
    story = environment(new_story)
    start(story)
    story.hook("s-1", JOURNAL_TASK_LIST)
    story.run_listeners()
    expect_due(story, "journal-tasks")


def test_an_event_a_skill_names_makes_it_due_for_the_main_agent_of_the_environment(new_story):
    story = environment(new_story)
    start(story)
    story.run(f'task make "Fix the cart" --environment main')
    story.run("task start 1", actor=story.agent)
    story.run_listeners()
    expect_due(story, "journal-tasks")


def test_an_event_a_skill_names_makes_it_due_unless_the_agent_read_it(new_story):
    story = environment(new_story)
    start(story)
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-tasks", digest_of(story, "journal-tasks")), story.agent)
    story.run('task make "Fix the cart" --environment main')
    story.run("task start 1", actor=story.agent)
    story.run_listeners()
    expect_not_due(story, "journal-tasks")


def test_a_skill_already_loaded_at_the_same_digest_is_never_due(new_story):
    story = environment(new_story)
    start(story)
    story.container.get(Bus).run(LoadSkill(story.agent.id, "journal-notes", digest_of(story, "journal-notes")), story.agent)
    story.hook("s-1", HookSamples.prompt("please take a note of that"))
    story.run_listeners()
    expect_not_due(story, "journal-notes")
    assert f"journal-notes  {digest_of(story, 'journal-notes')}  loaded" in due_lines(story)

import json

from core.base.driver.command_category import CommandCategory
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.overview.support.overview_first import OverviewFirst
from core.modules.skills.support.main_agent_skills import MainAgentSkills
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story_fixture import StoryFixture
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.modules.messages.delivery import KeptTyping, MessagingSession
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value, expect_value_with, expect_value_without


def test_the_overview_shows_each_default_command_under_its_heading(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    text = story.run("overview", actor=story.user).output_text
    expect_value_with(text, "## task list --state open")
    expect_value_with(text, "Fix the cart")
    expect_value_with(text, "## question list")
    expect_value_with(text, "## message conversations")
    expect_value_with(text, "## usage own-messages")
    expect_value_with(text, "## plugin changes --since HEAD")
    expect_value_with(text, "## process list --state running")
    expect_value_with(text, "## process list --limit 5")
    expect_value_without(text, "has no")
    expect_value_without(text, "journal failed")
    expect_value_without(text, "unrecognized arguments")
    expect_replace_without(text, "Fix the cart\n", "", "Fix the cart  ")


def test_the_user_chooses_what_the_overview_shows(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('setting set journal.core.overview.commands "task board" --project', actor=story.user)
    answer = json.loads(story.run("overview --json", actor=story.user).output_text)
    expect_command_section_sections(answer, ["task board"])
    story.expect_no_text("overview", "question list", actor=story.user)


def test_a_command_that_fails_shows_why_and_the_others_still_run(new_story):
    story = new_story(fixture=UserJoined)
    story.run('setting set journal.core.overview.commands "nothing here,task board" --project', actor=story.user)
    text = story.run("overview", actor=story.user)
    text.expect_text("## nothing here")
    text.expect_text("## task board")


OVERVIEW_HOOK = HookSamples.shell("journal overview", ShellPart("journal", CommandCategory.JOURNAL, ["overview"], subcommand="overview"))
JOURNAL_LINE = HookSamples.shell("journal task list", ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"], subcommand="task"))
LISTING = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"]))
EDIT = HookSamples.edit("src/cart.py")
SKILL_READ = HookSamples.sample("pre_tool_use", {"name": "Read", "category": "read", "files": [".claude/skills/journal-tasks/SKILL.md"], "diff": None})
RESUME = HookSamples.session_start().with_raw({"source": "resume"})
COMPACTION = HookSamples.session_start().with_raw({"source": "compact"})
PRE_COMPACT = HookSamples.sample("compact").with_fields(accepts_lines=False)


def overview_story(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.container.bind(OverviewFirst, OverviewFirst())
    return story


def test_after_a_session_start_nothing_passes_before_the_overview_but_reading_a_skill(new_story):
    story = overview_story(new_story)
    story.hook("s-1", HookSamples.session_start())
    story.run_listeners()
    story.expect_hook_refusal("s-1", EDIT, "read the overview first")
    story.expect_hook_refusal("s-1", LISTING, "read the overview first")
    story.expect_hook_refusal("s-1", JOURNAL_LINE, "read the overview first")
    story.expect_hook_allowed("s-1", SKILL_READ)
    story.expect_hook_allowed("s-1", OVERVIEW_HOOK)
    story.expect_hook_allowed("s-1", EDIT)


def test_a_compaction_blocks_again_and_a_resume_does_not(new_story):
    story = overview_story(new_story)
    story.hook("s-1", HookSamples.session_start())
    story.hook("s-1", OVERVIEW_HOOK)
    story.hook("s-1", RESUME)
    story.expect_hook_allowed("s-1", EDIT)
    story.hook("s-1", COMPACTION)
    story.expect_hook_refusal("s-1", EDIT, "read the overview first")


class CartWork(StoryFixture):
    parent = MessagingSession

    def steps(self, story):
        agent = story.agent
        story.run('task make "Fix the cart" --environment main', actor=story.user)
        story.run('rule make "Always keep the cart small" --environment main', actor=story.user)
        story.expect_success('memory make "The cart is small" --weight 5 --environment main', actor=agent)
        story.run('message send "Are you there" --environment main', actor=story.user)
        story.run_listeners()


def compacted_story(new_story):
    story = new_story(SAMPLES, fixture=CartWork)
    story.container.bind(OverviewFirst, OverviewFirst())
    return story


def test_a_whole_compaction_tells_the_agent_only_to_run_the_overview(new_story):
    story = compacted_story(new_story)
    compaction_lines = story.hook("s-1", PRE_COMPACT).lines
    story.run_listeners()
    start_lines = story.hook("s-1", COMPACTION).lines
    story.run_listeners()
    expect_value(list(compaction_lines), [])
    expect_value(list(start_lines), ["read the overview"])
    story.expect_hook_silent("s-1", SKILL_READ)
    story.expect_hook_refusal("s-1", EDIT, "read the overview first")
    story.expect_hook_allowed("s-1", OVERVIEW_HOOK)
    story.expect_hook_allowed("s-1", EDIT, "new message 1")


def test_nothing_is_typed_to_an_agent_that_starts_again_after_a_compaction(new_story):
    story = compacted_story(new_story)
    typing = KeptTyping()
    story.container.bind(TerminalTyping, typing)
    story.hook("s-1", PRE_COMPACT)
    story.hook("s-1", COMPACTION)
    story.run('message send "One more thing" --environment main', actor=story.user)
    story.run_listeners()
    expect_value(typing.typed, [])


def test_a_new_session_is_told_to_run_the_overview(new_story):
    story = overview_story(new_story)
    story.expect_hook_allowed("s-1", HookSamples.session_start(), "read the overview")


def test_the_overview_shows_the_memories(new_story):
    story = compacted_story(new_story)
    text = story.run("overview", actor=story.agent, environment_id=1).output_text
    expect_value_with(text, "## memory list")
    expect_value_with(text, "The cart is small")
    expect_value_with(text, "message 1")


def expect_command_section_sections(answer, expected) -> None:
    actual = [section['command'] for section in answer['sections']]
    assert actual == expected, actual


def expect_replace_without(text, text_2, text_3, expected) -> None:
    actual = text.replace(text_2, text_3)
    assert expected not in actual, actual


def test_the_overview_lists_the_skills_the_agent_must_load_with_how_to_load_each(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.container.bind(MainAgentSkills, MainAgentSkills())
    agent = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    story.run_listeners()
    story.expect_text("skill required", "load this first with the Skill tool: journal-tasks", actor=agent)
    story.expect_text("overview", "## skill required", "load this first with the Skill tool: journal-tasks", actor=agent)


def test_a_person_has_no_skills_to_load(new_story):
    story = overview_story(new_story)
    story.expect_text("skill required", "no skills to load", actor=story.user)

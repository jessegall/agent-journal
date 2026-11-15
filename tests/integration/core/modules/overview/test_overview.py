import pytest

import json
from datetime import timedelta

from engine.enums.command_category import CommandCategory
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from core.modules.overview.support.overview_blocks import OverviewBlocks
from core.modules.overview.support.overview_first import OverviewFirst
from core.modules.skills.support.main_agent_skills import MainAgentSkills
from tests.stories.engine.driver.support.hook_agents import hook_agent
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.engine.driver.support.fixtures import SampleSuiteChoice
from tests.stories.engine.driver.support.samples import SAMPLES
from tests.stories.core.modules.messages.delivery import KeptTyping, MessagingSession
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value, expect_value_with, expect_value_without
from core.modules.overview.nudges.overview_line_nudge import OverviewLineNudge
from core.modules.messages.nudges.new_message_nudge import NewMessageNudge
from core.modules.overview.nudges.overview_refusal_nudge import OverviewRefusalNudge
from engine.testing.expectations.expected_nudge import expected_nudge
from core.modules.overview.support.overview_settings import COMMANDS_KEY


def test_the_overview_shows_each_default_command_under_its_heading(played):
    story = played(UserJoined)
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


def test_the_user_chooses_what_the_overview_shows(played):
    story = played(UserJoined)
    story.expect_success(f'setting set {COMMANDS_KEY} "task board" --project', actor=story.user)
    answer = json.loads(story.run("overview --json", actor=story.user).output_text)
    expect_command_section_sections(answer, ["task board"])
    story.expect_no_text("overview", "question list", actor=story.user)


def test_a_command_that_fails_shows_why_and_the_others_still_run(played):
    story = played(UserJoined)
    story.run(f'setting set {COMMANDS_KEY} "nothing here,task board" --project', actor=story.user)
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


def overview_story(played):
    story = played(SampleSuiteChoice, SAMPLES)
    story.replace(OverviewFirst, OverviewFirst())
    return story


def test_after_a_session_start_nothing_passes_before_the_overview_but_a_skill_read_and_a_shell_read(played):
    story = overview_story(played)
    story.hook("s-1", HookSamples.session_start())
    story.run_listeners()
    story.expect_hook_refusal("s-1", EDIT, expected_nudge(OverviewRefusalNudge.declared()))
    story.expect_hook_allowed("s-1", LISTING)
    story.expect_hook_refusal("s-1", JOURNAL_LINE, expected_nudge(OverviewRefusalNudge.declared()))
    repeated = story.hook("s-1", EDIT).refusal
    story.expect_rows(expected_nudge(OverviewRefusalNudge.declared()).matches_text(repeated), "refusal skip" not in repeated, detail=repeated)
    story.expect_hook_allowed("s-1", SKILL_READ)
    story.expect_hook_allowed("s-1", OVERVIEW_HOOK)
    story.expect_hook_allowed("s-1", EDIT)


def test_a_main_agent_whose_overview_hook_was_lost_reads_it_again_and_its_next_command_goes_through(played):
    story = overview_story(played)
    agent = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    story.run_listeners()
    story.advance(timedelta(seconds=1))
    story.expect_success("overview", actor=agent)
    story.expect_success("overview", actor=agent)
    story.expect_hook_allowed("s-1", EDIT)
    story.run_listeners()
    story.expect_rows(not story.container.get(OverviewBlocks).is_blocked(agent.id))


def test_a_compaction_blocks_again_and_a_resume_does_not(played):
    story = overview_story(played)
    story.hook("s-1", HookSamples.session_start())
    story.hook("s-1", OVERVIEW_HOOK)
    story.hook("s-1", RESUME)
    story.expect_hook_allowed("s-1", EDIT)
    story.hook("s-1", COMPACTION)
    story.expect_hook_refusal("s-1", EDIT, expected_nudge(OverviewRefusalNudge.declared()))


class CartWork(StoryFixture):
    parent = MessagingSession

    def steps(self, story):
        agent = story.agent
        story.run('task make "Fix the cart" --environment main', actor=story.user)
        story.run('rule make "Always keep the cart small" --environment main', actor=story.user)
        story.expect_success('memory make "The cart is small" --weight 5 --environment main', actor=agent)
        story.run('message send "Are you there" --environment main', actor=story.user)
        story.run_listeners()


def compacted_story(played):
    story = played(CartWork, SAMPLES)
    story.replace(OverviewFirst, OverviewFirst())
    return story


@pytest.fixture
def compacted(played):
    story = compacted_story(played)
    typing = KeptTyping()
    story.replace(TerminalTyping, typing)
    compaction_lines = story.hook("s-1", PRE_COMPACT).lines
    story.run_listeners()
    start_lines = story.hook("s-1", COMPACTION).lines
    story.run_listeners()
    return story, typing, compaction_lines, start_lines


def test_a_whole_compaction_is_given_the_summary_instructions_and_the_start_after_it_only_the_overview_and_its_message(compacted):
    story, _, compaction_lines, start_lines = compacted
    expect_value(list(compaction_lines), [ClaudeCodeProvider.compaction_instructions])
    expect_value(list(start_lines), [NewMessageNudge.declared().nudge(message=1).text, OverviewLineNudge.declared().nudge().text])
    story.expect_hook_allowed("s-1", SKILL_READ)
    story.expect_hook_refusal("s-1", EDIT, expected_nudge(OverviewRefusalNudge.declared()))
    story.expect_hook_allowed("s-1", OVERVIEW_HOOK)
    story.expect_hook_allowed("s-1", EDIT)


def test_nothing_is_typed_to_an_agent_that_starts_again_after_a_compaction(compacted):
    story, typing, _, _ = compacted
    story.run('message send "One more thing" --environment main', actor=story.user)
    story.run_listeners()
    expect_value(typing.typed, [])


def test_the_overview_shows_the_memories(played):
    story = compacted_story(played)
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


def test_the_overview_lists_the_skills_the_agent_must_load_with_how_to_load_each(played):
    story = played(SampleSuiteChoice, SAMPLES)
    story.replace(MainAgentSkills, MainAgentSkills())
    agent = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    story.run_listeners()
    story.expect_text("skill required", "load this first with the Skill tool: journal-tasks", actor=agent)
    story.expect_text("overview", "## skill required", "load this first with the Skill tool: journal-tasks", actor=agent)


def test_a_person_has_no_skills_to_load(played):
    story = overview_story(played)
    story.expect_text("skill required", "no skills to load", actor=story.user)

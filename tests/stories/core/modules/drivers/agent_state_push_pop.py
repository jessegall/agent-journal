import pytest

from engine.actor.actor import Actor
from engine.command.errors.completed_command_error import CompletedCommandError
from engine.driver.open_hold import OpenHold
from engine.driver.conditions.ran_command import RanCommand
from engine.driver.nudge import Nudge
from engine.enums.command_category import CommandCategory
from engine.enums.nudge_type import NudgeType
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.drivers.commands.close_agent_block.close_agent_block import CloseAgentBlock
from core.modules.drivers.models.agent_block import AgentBlock
from tests.stories.core.modules.drivers.block_until import LINE, shell
from tests.stories.engine.driver.support.fixtures import LeadStarted
from tests.stories.engine.driver.support.samples import SAMPLES

OVERVIEW = shell("journal overview", ShellPart("journal", CommandCategory.JOURNAL, ["overview"], subcommand="overview"))
EDIT = HookSamples.edit("src/cart.py")


class PushedBlock(StoryFixture):
    """The lead is held by a block a command pushed, until it runs journal overview."""

    parent = LeadStarted

    def steps(self, story):
        story.run_command(OpenHold(story.agent.id, Nudge("samples.wait", NudgeType.REFUSAL, LINE), RanCommand("journal overview")), Actor.core())


class SkippableBlock(StoryFixture):
    """The lead is held by a block a command pushed that its user may skip."""

    parent = LeadStarted

    def steps(self, story):
        story.run_command(OpenHold(story.agent.id, Nudge("samples.wait", NudgeType.REFUSAL, LINE), RanCommand("journal overview"), is_skippable=True), Actor.core())


def open_blocks(story) -> list[AgentBlock]:
    return [block for block in story.story_rows(AgentBlock) if block.closed_at is None]


def test_a_block_pushed_by_a_command_refuses_the_next_tool_use(new_story):
    story = new_story(SAMPLES, fixture=PushedBlock)
    story.expect_hook_refusal("s-1", EDIT, LINE)
    story.expect_rows(len(open_blocks(story)) == 1)


def test_pushing_the_same_block_twice_keeps_one_open_block(new_story):
    story = new_story(SAMPLES, fixture=PushedBlock)
    story.run_command(OpenHold(story.agent.id, Nudge("samples.wait", NudgeType.REFUSAL, LINE), RanCommand("journal overview")), Actor.core())
    story.expect_rows(len(open_blocks(story)) == 1, detail=str(len(open_blocks(story))))


def test_a_rule_pops_a_block_by_closing_its_row_and_the_next_hook_is_allowed(new_story):
    story = new_story(SAMPLES, fixture=PushedBlock)
    story.run_command(CloseAgentBlock(open_blocks(story)[0].id), Actor.core())
    story.expect_hook_allowed("s-1", EDIT)


def test_a_block_closes_by_itself_when_the_agent_does_what_it_waits_for_and_popping_it_then_changes_nothing(new_story):
    story = new_story(SAMPLES, fixture=PushedBlock)
    closed = open_blocks(story)[0].id
    story.hook("s-1", OVERVIEW)
    story.expect_hook_allowed("s-1", EDIT)
    story.expect_rows(open_blocks(story) == [])
    with pytest.raises(CompletedCommandError, match="settled already"):
        story.run_command(CloseAgentBlock(closed), Actor.core())
    story.expect_hook_allowed("s-1", EDIT)
    story.expect_rows(open_blocks(story) == [])


def test_no_command_opens_or_closes_a_state_and_the_agent_leaves_only_by_the_block_commands(new_story):
    story = new_story(SAMPLES, fixture=PushedBlock)
    listed = story.run("agent-block --help", actor=story.agent).output_text
    story.expect_rows("list" in listed and "skip" in listed, "push" not in listed and "pop" not in listed, detail=listed)


def test_the_user_ends_a_stuck_block_by_skipping_its_row_with_a_reason(new_story):
    story = new_story(SAMPLES, fixture=SkippableBlock)
    block = open_blocks(story)[0]
    story.expect_success(f'agent-block skip {block.id} --reason "the block no longer applies"', f"agent_block {block.id} skipped: the block no longer applies", actor=story.user)
    story.expect_hook_allowed("s-1", EDIT)
    story.expect_rows(open_blocks(story) == [])

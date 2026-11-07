import pytest

from core.base.driver.command_category import CommandCategory
from core.modules.drivers.support.block_conditions.all_conditions import AllConditions
from core.modules.drivers.support.block_conditions.any_condition import AnyCondition
from core.base.driver.conditions.ran_command import RanCommand
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES
from core.base.command.bus import Bus
from core.base.actor import Actor
from core.base.driver.block_until import BlockUntil
from core.base.driver.nudge import Nudge
from core.base.driver.nudge_type import NudgeType

READ = ShellPart("cat", CommandCategory.READ, ["notes"])
JOURNAL = ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"], subcommand="task")
BUILD = ShellPart("make", CommandCategory.BUILD, ["all"])
LINE = "wait for it"


def blocked_story(new_story, condition):
    story = new_story(SAMPLES, fixture=LeadStarted)
    agent = story.agent
    story.container.get(Bus).run(BlockUntil(agent.id, Nudge("samples.wait", NudgeType.REFUSAL, LINE), condition), Actor.core())
    return story


def shell(line, *parts):
    return HookSamples.shell(line, *parts)


def test_a_block_lets_through_a_chain_of_only_reading_and_journal_commands(new_story):
    story = blocked_story(new_story, RanCommand("journal overview"))
    story.expect_hook_allowed("s-1", shell("cat notes", READ))
    story.expect_hook_allowed("s-1", shell("journal task list", JOURNAL))
    story.expect_hook_allowed("s-1", shell("cat notes && journal task list", READ, JOURNAL))


def test_a_block_refuses_a_chain_with_any_other_part_and_any_other_tool(new_story):
    story = blocked_story(new_story, RanCommand("journal overview"))
    story.expect_hook_refusal("s-1", shell("cat notes && make all", READ, BUILD), LINE)
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), LINE)


def test_a_block_ends_when_its_condition_is_true(new_story):
    story = blocked_story(new_story, RanCommand("journal overview"))
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), LINE)
    story.hook("s-1", shell("journal overview", ShellPart("journal", CommandCategory.JOURNAL, ["overview"], subcommand="overview")))
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))


@pytest.mark.parametrize("condition,line,ends", [(AnyCondition(RanCommand("journal a"), RanCommand("journal b")), "journal b", True),
                                                 (AllConditions(RanCommand("journal a"), RanCommand("journal b")), "journal b", False)])
def test_conditions_combine(condition_story, ends):
    story = condition_story
    edit = story.hook("s-1", HookSamples.edit("src/cart.py"))
    expect_changed_bool(edit, ends)


@pytest.fixture
def condition_story(new_story, condition, line):
    story = blocked_story(new_story, condition)
    story.hook("s-1", shell(line, ShellPart("journal", CommandCategory.JOURNAL, [line.split()[1]], subcommand=line.split()[1])))
    return story


def expect_changed_bool(edit, expected) -> None:
    actual = bool(edit.refusal)
    assert actual is not expected, actual

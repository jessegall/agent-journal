import pytest

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.driver.block_until import BlockUntil
from engine.driver.nudge import Nudge
from engine.enums.nudge_type import NudgeType
from engine.testing.examples.hook_samples import HookSamples
from core.modules.drivers.errors.missing_block_target_refusal import MissingBlockTargetRefusal
from core.modules.processes.support.block_conditions.output_read import OutputRead
from tests.stories.core.modules.processes.support.process_samples import end_run, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted

LINE = "read that output first"
MISSING_OUTPUT = 999_999


def block_on(story, output_id: int) -> None:
    story.container.get(Bus).run(BlockUntil(story.agent.id, Nudge("samples.read-output", NudgeType.REFUSAL, LINE), OutputRead(output_id)), Actor.core())


def test_a_block_on_an_output_that_does_not_exist_is_refused_when_made(new_story):
    story = new_story(fixture=BuilderStarted)
    with pytest.raises(MissingBlockTargetRefusal, match=str(MISSING_OUTPUT)):
        block_on(story, MISSING_OUTPUT)
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))


def test_a_block_whose_output_is_deleted_closes_itself(new_story):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, "make test")
    block_on(story, process.id)
    end_run(story, process, "ok\n")
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), LINE)
    story.expect_success(f"process delete {process.id}")
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))

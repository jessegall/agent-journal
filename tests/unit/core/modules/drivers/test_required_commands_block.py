from core.modules.drivers.support.required_commands import RequiredCommands
from core.modules.processes.support.block_conditions.output_read_since_block import OutputReadSinceBlock
from core.modules.processes.support.block_conditions.output_titled import OutputTitled
from core.modules.processes.nudges.run_name_nudge import RunNameNudge
from core.modules.processes.nudges.silent_run_blocked_nudge import SilentRunBlockedNudge


def test_a_read_block_names_the_output_and_closes_with_the_read_of_that_output_not_with_a_flag_number():
    block = RequiredCommands.block(1, SilentRunBlockedNudge.declared().nudge(output=22872, seconds=30, processor="1s", hint="read it"))
    assert "read output 22872" in block.nudge.text
    assert isinstance(block.condition, OutputReadSinceBlock) and block.condition.text == "22872"


def test_a_title_block_closes_with_the_title_of_its_output():
    block = RequiredCommands.block(1, RunNameNudge.declared().nudge(process=3531))
    assert "title output 3531" in block.nudge.text
    assert isinstance(block.condition, OutputTitled) and block.condition.text == "3531"

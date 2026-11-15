from core.modules.drivers.support.required_commands import RequiredCommands
from core.modules.processes.support.block_conditions.output_read_since_block import OutputReadSinceBlock
from core.modules.processes.support.block_conditions.output_titled import OutputTitled
from core.modules.processes.agent_messages.run_name_message import RunNameMessage
from core.modules.processes.agent_messages.silent_run_blocked_message import SilentRunBlockedMessage


def test_a_read_block_names_the_output_and_closes_with_the_read_of_that_output_not_with_a_flag_number():
    block = RequiredCommands.block(1, SilentRunBlockedMessage.declared().agent_message(output=22872, seconds=30, processor="1s", hint="read it"))
    assert "read output 22872" in block.agent_message.text
    assert isinstance(block.condition, OutputReadSinceBlock) and block.condition.text == "22872"


def test_a_title_block_closes_with_the_title_of_its_output():
    block = RequiredCommands.block(1, RunNameMessage.declared().agent_message(process=3531))
    assert "title output 3531" in block.agent_message.text
    assert isinstance(block.condition, OutputTitled) and block.condition.text == "3531"

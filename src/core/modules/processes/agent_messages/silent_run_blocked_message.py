from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType
from core.modules.processes.support.block_conditions.output_read_during_block import OutputReadDuringBlock


class SilentRunBlockedMessage(MessageTemplate):
    """The agent message processes.silent_run_held."""

    key = "processes.silent_run_held"
    type = AgentMessageType.REFUSAL
    text = "Output {output} printed nothing for {seconds}s, CPU time {processor}: {hint}"
    required_command = "journal output read {output} --tail 5"
    closing_condition = OutputReadDuringBlock

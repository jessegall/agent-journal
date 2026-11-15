from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReadCommandOutputMessage(MessageTemplate):
    """The agent message processes.read_command_output."""

    key = "processes.read_command_output"
    type = AgentMessageType.REFUSAL
    text = "Run the read command directly, without a pipe or redirect"

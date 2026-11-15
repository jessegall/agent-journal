from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class RequiredMonitorCommandMessage(MessageTemplate):
    """The agent message processes.monitor_command_required."""

    key = "processes.monitor_command_required"
    type = AgentMessageType.REFUSAL
    text = "Output {output} is still running: wait for it before you stop"

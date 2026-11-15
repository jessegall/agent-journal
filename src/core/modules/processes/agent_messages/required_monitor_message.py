from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class RequiredMonitorMessage(MessageTemplate):
    """The agent message processes.monitor_required."""

    key = "processes.monitor_required"
    type = AgentMessageType.REFUSAL
    text = "Output {output} is still running: set a Monitor on its wait before you stop"

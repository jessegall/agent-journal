from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MonitorToolRequiredMessage(MessageTemplate):
    """The agent message processes.monitor_command_outside."""

    key = "processes.monitor_command_outside"
    type = AgentMessageType.REFUSAL
    text = "The output wait only runs in a Monitor: give it to the Monitor tool and keep working"

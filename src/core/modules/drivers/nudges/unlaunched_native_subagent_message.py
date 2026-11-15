from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnlaunchedNativeSubagentMessage(MessageTemplate):
    """The nudge drivers.native_subagent_no_launch."""

    key = "drivers.native_subagent_no_launch"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "No helper launch is running: do this work yourself"

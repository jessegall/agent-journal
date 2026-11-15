from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class NativeSubagentMessage(MessageTemplate):
    """The nudge drivers.native_subagent."""

    key = "drivers.native_subagent"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "Start a helper for this, with a profile and a brief"

from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class NativeMemoryBanMessage(MessageTemplate):
    """The nudge claude_code.native_memory_ban."""

    key = "claude_code.native_memory_ban"
    type = AgentMessageType.REFUSAL
    text = "Do not write Claude's own memory files: memories belong in the journal"

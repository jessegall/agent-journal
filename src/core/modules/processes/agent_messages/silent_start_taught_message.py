from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SilentStartTaughtMessage(MessageTemplate):
    """The agent message processes.silent_start_taught."""

    key = "processes.silent_start_taught"
    type = AgentMessageType.NOTICE
    text = "{name} ran {seconds}s with no percent in the chat. Its output has line shape {shape}, and it {hint}. Add or adjust a reader now: it applies to a running output at once, so do not wait for it to end."

from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PausedRefusalMessage(MessageTemplate):
    """The agent message drivers.paused."""

    key = "drivers.paused"
    type = AgentMessageType.REFUSAL
    text = "The user paused you: only journal commands and reads run until you are resumed; reply in the chat"
    turn_limited = False

from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class OpeningLineMessage(MessageTemplate):
    """The nudge drivers.opening_line."""

    key = "drivers.opening_line"
    type = AgentMessageType.NOTICE
    text = '{text}'
    turn_limited = False

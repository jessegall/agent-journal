from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class AgentCompactedMessage(MessageTemplate):
    """The nudge drivers.compacted."""

    key = "drivers.compacted"
    type = AgentMessageType.STEERING
    text = "Your context was compacted: read the overview, then continue your work"
    turn_limited = False
    wakes_agent = True

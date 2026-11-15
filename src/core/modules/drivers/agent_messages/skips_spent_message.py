from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SkipsSpentMessage(MessageTemplate):
    """The nudge drivers.skips_spent."""

    key = "drivers.skips_spent"
    type = AgentMessageType.STEERING
    text = "agent:{agent} skipped {count} refusals in a row and lost the right to skip"
    turn_limited = False
    wakes_agent = True

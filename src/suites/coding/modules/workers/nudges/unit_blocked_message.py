from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnitBlockedMessage(MessageTemplate):
    """The nudge workers.unit_blocked."""

    key = "workers.unit_blocked"
    type = AgentMessageType.STEERING
    text = "worker:{worker} committed {committed}; every task left in its unit is blocked: {waits}"
    wakes_agent = True

from engine.driver.message_template import MessageTemplate
from engine.enums.line_delivery import LineDelivery
from engine.enums.agent_message_type import AgentMessageType


class JournalStartedMessage(MessageTemplate):
    """The agent message drivers.journal_started."""

    key = "drivers.journal_started"
    delivery = LineDelivery.WAKE_HOOK
    type = AgentMessageType.STEERING
    text = "The journal started again while you were working: go on"
    turn_limited = False
    wakes_agent = True

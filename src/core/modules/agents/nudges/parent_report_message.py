from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ParentReportMessage(MessageTemplate):
    """The nudge agents.report."""

    key = "agents.report"
    delivery = LineDelivery.WAKE_HOOK
    type = AgentMessageType.STEERING
    text = "agent:{agent} reported in message:{message}: read it and act on it"
    turn_limited = False
    wakes_agent = True

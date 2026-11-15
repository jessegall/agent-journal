from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class EscalationAnsweredMessage(MessageTemplate):
    """The nudge drivers.escalation-answered, which wakes the agent whose escalation its responder answered."""

    key = "drivers.escalation-answered"
    type = AgentMessageType.STEERING
    text = "Your escalation was answered, so go on as it says: journal escalation show {escalation}"
    turn_limited = False
    wakes_agent = True

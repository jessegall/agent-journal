from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class EscalationHelpMessage(MessageTemplate):
    """The nudge drivers.escalation-help, which wakes the parent an agent asked for help."""

    key = "drivers.escalation-help"
    type = AgentMessageType.STEERING
    text = "Agent {agent} asks for your help after {count} refusals in a row: journal escalation show {escalation}"
    turn_limited = False
    wakes_agent = True

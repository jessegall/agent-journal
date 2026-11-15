from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class OutputCheckMessage(MessageTemplate):
    """The agent message processes.output_check."""

    key = "processes.output_check"
    delivery = LineDelivery.WAKE_HOOK
    type = AgentMessageType.STEERING
    text = "Output {output} has run {minutes} min: check it is doing its work"
    required_command = "journal output confirm {output}"
    wakes_agent = True
    turn_limited = False

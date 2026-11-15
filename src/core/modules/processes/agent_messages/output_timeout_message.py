from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class OutputTimeoutMessage(MessageTemplate):
    """The agent message processes.output_timed_out."""

    key = "processes.output_timed_out"
    delivery = LineDelivery.WAKE_HOOK
    type = AgentMessageType.STEERING
    text = "Output {output} timed out after {seconds}s and was stopped: its output is kept"
    wakes_agent = True

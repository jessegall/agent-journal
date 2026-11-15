from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class HungRunMessage(MessageTemplate):
    """The nudge processes.hung_run."""

    key = "processes.hung_run"
    delivery = LineDelivery.WAKE_HOOK
    type = AgentMessageType.STEERING
    text = "Output {output} printed nothing for {seconds}s and was stopped: its output is kept"
    wakes_agent = True

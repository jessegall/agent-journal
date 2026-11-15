from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class RunFrozenMessage(MessageTemplate):
    """The agent message processes.run_frozen."""

    key = "processes.run_frozen"
    delivery = LineDelivery.WAKE_HOOK
    type = AgentMessageType.STEERING
    text = "Output {output} printed nothing for {seconds}s and uses no CPU: read it, or it is stopped at {limit}s"
    wakes_agent = True

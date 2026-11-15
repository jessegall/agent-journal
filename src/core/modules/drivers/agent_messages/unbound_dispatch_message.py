from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnboundDispatchMessage(MessageTemplate):
    """The nudge drivers.unbound_dispatch."""

    key = "drivers.unbound_dispatch"
    type = AgentMessageType.REFUSAL
    text = "The dispatch has no concrete job: give it a description and a bounded prompt"
    turn_limited = False

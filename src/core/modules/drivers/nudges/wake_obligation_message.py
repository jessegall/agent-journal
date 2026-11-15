from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WakeObligationMessage(MessageTemplate):
    """The nudge drivers.wake: the one line the wake delivery owner gives an agent whose work needs it."""

    key = "drivers.wake"
    type = AgentMessageType.STEERING
    text = "Work waits for you: read journal overview and go on with it"
    turn_limited = False
    wakes_agent = True

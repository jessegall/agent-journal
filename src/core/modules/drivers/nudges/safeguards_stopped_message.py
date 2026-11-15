from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SafeguardsStoppedMessage(MessageTemplate):
    """The nudge drivers.safeguards_stopped."""

    key = "drivers.safeguards_stopped"
    type = AgentMessageType.STEERING
    text = "An API safeguards error ended your last turn: continue your work"
    turn_limited = False
    wakes_agent = True

from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class LockdownEndedMessage(MessageTemplate):
    """The nudge helpers.lockdown_ended."""

    key = "helpers.lockdown_ended"
    type = AgentMessageType.STEERING
    text = "The usage limit ended: continue what you were doing"
    turn_limited = False
    wakes_agent = True

from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WaitEndedMessage(MessageTemplate):
    """The agent message waits.wait_over."""

    key = "waits.wait_over"
    type = AgentMessageType.STEERING
    text = "wait:{wait} is over: continue"
    plural_text = "waits {wait} are over"
    id_field = "wait"
    turn_limited = False
    wakes_agent = True

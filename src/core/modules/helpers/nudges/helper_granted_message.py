from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class HelperGrantedMessage(MessageTemplate):
    """The nudge helpers.granted."""

    key = "helpers.granted"
    type = AgentMessageType.STEERING
    text = "helper-grant:{grant} lists what you may run with your helper run command"
    turn_limited = False
    wakes_agent = True
    id_field = "grant"
    plural_text = "helper-grants {grant} say what you may run"

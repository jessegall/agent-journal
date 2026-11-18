from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SteerUnansweredMessage(MessageTemplate):
    """The agent message helpers.steer_unanswered."""

    key = "helpers.steer_unanswered"
    type = AgentMessageType.REFUSAL
    text = "Your parent added helper-steer:{steer} to your job: act on it now"
    turn_limited = False
    id_field = "steer"

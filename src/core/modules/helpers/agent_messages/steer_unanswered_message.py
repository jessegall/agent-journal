from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SteerUnansweredMessage(MessageTemplate):
    """The agent message helpers.steer_unanswered."""

    key = "helpers.steer_unanswered"
    type = AgentMessageType.REFUSAL
    text = 'helper-steer:{steer} changes your job: run journal helper answer-steer {steer} "<what you change>" first'
    turn_limited = False
    id_field = "steer"

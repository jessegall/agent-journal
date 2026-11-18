from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SteerUnansweredStopMessage(MessageTemplate):
    """The agent message helpers.steer_unanswered_at_stop."""

    key = "helpers.steer_unanswered_at_stop"
    type = AgentMessageType.REFUSAL
    text = 'helper-steer:{steer} is unanswered: run journal helper answer-steer {steer} "<what you change>" before you report'
    turn_limited = False
    id_field = "steer"

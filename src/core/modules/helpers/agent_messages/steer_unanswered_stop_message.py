from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SteerUnansweredStopMessage(MessageTemplate):
    """The agent message helpers.steer_unanswered_at_stop."""

    key = "helpers.steer_unanswered_at_stop"
    type = AgentMessageType.REFUSAL
    text = "Your parent added helper-steer:{steer} to your job: answer it and take it into your work before you report"
    turn_limited = False
    id_field = "steer"

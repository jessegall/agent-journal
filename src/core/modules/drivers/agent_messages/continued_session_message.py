from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ContinuedSessionMessage(MessageTemplate):
    """The agent message drivers.continued_session."""

    key = "drivers.continued_session"
    type = AgentMessageType.NOTICE
    text = "You are resuming earlier session {agent}: tell the user in one line, in your voice, then continue the work in hand or ask what is next"
    turn_limited = False

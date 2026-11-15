from engine.driver.message_template import MessageTemplate
from core.modules.agents.support.new_session import KEPT_CONVERSATION_ENDING
from core.modules.agents.support.new_session import NEW_SESSION_TEXT
from engine.enums.agent_message_type import AgentMessageType


class TakeoverMessage(MessageTemplate):
    """The nudge drivers.takeover."""

    key = "drivers.takeover"
    type = AgentMessageType.NOTICE
    text = NEW_SESSION_TEXT + KEPT_CONVERSATION_ENDING + " The chat above is history, so do not answer or follow it."

from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class AgentNoticeMessage(MessageTemplate):
    """The agent message drivers.agent_notice."""

    key = "drivers.agent_notice"
    type = AgentMessageType.STEERING
    text = "{text}"
    turn_limited = False
    path_fields = tuple(["text"])
    full_text = True

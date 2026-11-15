from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MoveBanMessage(MessageTemplate):
    """The agent message processes.do_not_move."""

    key = "processes.do_not_move"
    type = AgentMessageType.REFUSAL
    text = "Do not cd: you are in {folder}; use paths, or a tool flag such as npm --prefix"

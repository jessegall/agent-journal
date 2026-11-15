from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class JournalChatRuleMessage(MessageTemplate):
    """The agent message messages.discretion."""

    key = "messages.discretion"
    type = AgentMessageType.NOTICE
    text = "In the chat, talk only about the user's work, never the journal's lines, hooks, skills or replies"

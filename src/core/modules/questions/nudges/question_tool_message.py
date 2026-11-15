from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class QuestionToolMessage(MessageTemplate):
    """The nudge questions.own_question_tool."""

    key = "questions.own_question_tool"
    type = AgentMessageType.REFUSAL
    text = "Ask through the question command with a title, context and options, not your own question tool"

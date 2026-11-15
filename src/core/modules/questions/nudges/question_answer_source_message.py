from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class QuestionAnswerSourceMessage(MessageTemplate):
    """The nudge questions.answer_source."""

    key = "questions.answer_source"
    type = AgentMessageType.NOTICE
    text = "question:{question} was answered by message:{message}"
    plural_text = "answer sources: {reference}"

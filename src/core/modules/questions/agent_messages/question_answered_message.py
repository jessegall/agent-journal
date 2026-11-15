from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class QuestionAnsweredMessage(MessageTemplate):
    """The agent message questions.question_answered."""

    key = "questions.question_answered"
    type = AgentMessageType.NOTICE
    text = "question:{question} is answered"
    plural_text = "questions {question} are answered"
    id_field = "question"

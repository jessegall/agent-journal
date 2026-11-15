from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class QuestionClosedMessage(MessageTemplate):
    """The agent message questions.question_closed."""

    key = "questions.question_closed"
    type = AgentMessageType.NOTICE
    text = "The user closed question:{question} without answering"
    plural_text = "the user closed questions {question} unanswered"
    id_field = "question"

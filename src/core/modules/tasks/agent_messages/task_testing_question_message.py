from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TaskTestingQuestionMessage(MessageTemplate):
    """The nudge tasks.testing_question."""

    key = "tasks.testing_question"
    type = AgentMessageType.STEERING
    text = "Did you mean to move task:{task} to testing first?"
    turn_limited = False

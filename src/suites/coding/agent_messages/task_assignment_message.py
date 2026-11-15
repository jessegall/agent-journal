from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TaskAssignmentMessage(MessageTemplate):
    """The nudge coding.task_is_yours."""

    key = "coding.task_is_yours"
    type = AgentMessageType.REFUSAL
    text = 'task:{task} is yours now'

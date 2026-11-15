from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnfinishedTasksMessage(MessageTemplate):
    """The nudge coding.unfinished_tasks."""

    key = "coding.unfinished_tasks"
    type = AgentMessageType.REFUSAL
    text = "Tasks {tasks} are yours and unfinished: start one, block it on what it waits for, or say why you stop"

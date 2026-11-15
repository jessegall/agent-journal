from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TaskMetadataReminderMessage(MessageTemplate):
    """The nudge tasks.missing_metadata."""

    key = "tasks.missing_metadata"
    type = AgentMessageType.NOTICE
    text = "Task {task} is missing {missing}: set it"
    turn_limited = False

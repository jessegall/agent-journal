from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TaskHelperMetadataReminderMessage(MessageTemplate):
    """The nudge tasks.read_only_missing_metadata."""

    key = "tasks.read_only_missing_metadata"
    type = AgentMessageType.NOTICE
    text = "Task {task} is missing {missing}: ask the main agent to set it"
    turn_limited = False

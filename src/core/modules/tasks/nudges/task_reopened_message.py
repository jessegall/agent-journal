from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TaskReopenedMessage(MessageTemplate):
    """The nudge tasks.open_again."""

    key = "tasks.open_again"
    type = AgentMessageType.STEERING
    text = "task:{task} is open again: what it waited on has ended"

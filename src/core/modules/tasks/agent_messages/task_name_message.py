from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TaskNameMessage(MessageTemplate):
    """The nudge tasks.named_task."""

    key = "tasks.named_task"
    type = AgentMessageType.STEERING
    text = "Task {task} names open task {other}: if it waits on it, block it on that task"
    turn_limited = False

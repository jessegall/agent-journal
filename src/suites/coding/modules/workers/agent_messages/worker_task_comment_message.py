from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerTaskCommentMessage(MessageTemplate):
    """The agent message workers.task_comment."""

    key = "workers.task_comment"
    type = AgentMessageType.STEERING
    text = "The user commented on task:{task}: read it"
    turn_limited = False
    plural_text = 'the user commented on tasks {task}'
    id_field = "task"

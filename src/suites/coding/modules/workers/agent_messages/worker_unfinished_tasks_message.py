from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerUnfinishedTasksMessage(MessageTemplate):
    """The agent message workers.unfinished_tasks."""

    key = "workers.unfinished_tasks"
    type = AgentMessageType.STEERING
    text = "You ended with tasks left, {tasks}: {line}"
    path_fields = ["line"]

from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerTaskExpectedMessage(MessageTemplate):
    """The nudge workers.committed_task_awaited."""

    key = "workers.committed_task_awaited"
    type = AgentMessageType.STEERING
    text = "worker:{worker} waits on your committed task:{task}; to share it early, ask with --up-to {task}"
    turn_limited = False
    id_field = "task"

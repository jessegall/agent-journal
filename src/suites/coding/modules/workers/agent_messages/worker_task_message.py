from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerTaskMessage(MessageTemplate):
    """The agent message workers.worker_holds_task."""

    key = "workers.worker_holds_task"
    type = AgentMessageType.STEERING
    text = 'worker:{worker} has task:{task}'

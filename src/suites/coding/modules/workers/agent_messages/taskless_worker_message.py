from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TasklessWorkerMessage(MessageTemplate):
    """The agent message workers.worker_without_tasks."""

    key = "workers.worker_without_tasks"
    type = AgentMessageType.STEERING
    text = "worker:{worker} has no task left after its merge and stopped: it takes your next batch"
    wakes_agent = True

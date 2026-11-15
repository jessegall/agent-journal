from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class InactiveWorkerTasksMessage(MessageTemplate):
    """The agent message workers.idle_worker_tasks."""

    key = "workers.idle_worker_tasks"
    type = AgentMessageType.STEERING
    text = "worker:{worker} has stopped and holds {tasks}"
    turn_limited = False

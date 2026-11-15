from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerMergedMessage(MessageTemplate):
    """The agent message workers.worker_merged."""

    key = "workers.worker_merged"
    type = AgentMessageType.STEERING
    text = "worker:{worker} was merged"
    plural_text = "workers {worker} were merged"
    id_field = "worker"
    wakes_agent = True

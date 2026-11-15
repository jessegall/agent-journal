from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerTaskStartedMessage(MessageTemplate):
    """The agent message coding.worker_task_started."""

    key = "coding.worker_task_started"
    type = AgentMessageType.REFUSAL
    text = 'Not finished: {line}'
    path_fields = ["line"]

from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerTaskUnstartedMessage(MessageTemplate):
    """The nudge coding.worker_task_not_started."""

    key = "coding.worker_task_not_started"
    type = AgentMessageType.REFUSAL
    text = "Your task has not started: only reads and journal commands run until it does"

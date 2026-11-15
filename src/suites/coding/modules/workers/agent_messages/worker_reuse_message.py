from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerReuseMessage(MessageTemplate):
    """The nudge workers.reuse."""

    key = "workers.reuse"
    type = AgentMessageType.REFUSAL
    text = "worker:{worker} changed these files: send it the job, or give a reason for a new worker"
    turn_limited = False

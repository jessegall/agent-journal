from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerTaskReassignmentMessage(MessageTemplate):
    """The agent message workers.task_after_taken."""

    key = "workers.task_after_taken"
    type = AgentMessageType.STEERING
    text = "Your next task is task:{task}"
    turn_limited = False

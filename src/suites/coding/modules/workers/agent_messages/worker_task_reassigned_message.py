from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerTaskReassignedMessage(MessageTemplate):
    """The nudge workers.task_taken."""

    key = "workers.task_taken"
    type = AgentMessageType.STEERING
    text = 'task:{task} was taken from you: leave it'
    turn_limited = False

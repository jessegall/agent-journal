from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class BlockedWorkerTaskMessage(MessageTemplate):
    """The agent message workers.own_task_blocked."""

    key = "workers.own_task_blocked"
    type = AgentMessageType.STEERING
    text = 'task:{task} was blocked'
    turn_limited = False

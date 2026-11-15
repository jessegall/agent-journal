from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerTaskBlockedMessage(MessageTemplate):
    """The nudge workers.task_blocked."""

    key = "workers.task_blocked"
    type = AgentMessageType.STEERING
    text = "worker:{worker} blocked task:{task}: only you or a user can unblock it"
    turn_limited = False
    wakes_agent = True

from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class InactiveWorkerMessage(MessageTemplate):
    """The nudge workers.idle_worker."""

    key = "workers.idle_worker"
    type = AgentMessageType.STEERING
    text = "worker:{worker} has stopped"
    turn_limited = False

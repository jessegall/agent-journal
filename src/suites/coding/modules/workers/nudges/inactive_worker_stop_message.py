from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class InactiveWorkerStopMessage(MessageTemplate):
    """The nudge workers.worker_idle_stopped."""

    key = "workers.worker_idle_stopped"
    type = AgentMessageType.STEERING
    text = "worker:{worker} was idle too long and its process stopped; task:{task} stays with it"
    turn_limited = False

from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerOperationPausedMessage(MessageTemplate):
    """The nudge workers.operation_paused."""

    key = "workers.operation_paused"
    delivery = LineDelivery.WAKE_HOOK
    type = AgentMessageType.STEERING
    text = "worker:{worker} is paused: the job waits until it is resumed"
    turn_limited = False
    wakes_agent = True

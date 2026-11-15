from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerOperationUpdatedMessage(MessageTemplate):
    """The agent message workers.operation_updated."""

    key = "workers.operation_updated"
    delivery = LineDelivery.WAKE_HOOK
    type = AgentMessageType.STEERING
    text = 'worker:{worker} is up to date: output {output}'
    turn_limited = False
    wakes_agent = True

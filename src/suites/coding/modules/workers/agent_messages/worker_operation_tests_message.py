from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerOperationTestsMessage(MessageTemplate):
    """The nudge workers.operation_tests."""

    key = "workers.operation_tests"
    delivery = LineDelivery.WAKE_HOOK
    type = AgentMessageType.STEERING
    text = "task:{task} tests queued: this commit is done, so run tests yourself or stop; output {output}"
    turn_limited = False
    wakes_agent = True

from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerOperationFailedMessage(MessageTemplate):
    """The nudge workers.operation_failed."""

    key = "workers.operation_failed"
    type = AgentMessageType.STEERING
    text = "Worker command failed: output {output}"
    turn_limited = False
    wakes_agent = True

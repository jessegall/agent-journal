from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerOperationStartedMessage(MessageTemplate):
    """The agent message workers.operation_started."""

    key = "workers.operation_started"
    type = AgentMessageType.STEERING
    text = 'worker:{worker} started its next task: output {output}'
    turn_limited = False
    wakes_agent = True

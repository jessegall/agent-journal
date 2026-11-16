from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerOperationUpdateFailedMessage(MessageTemplate):
    """The agent message workers.operation_update_failed."""

    key = "workers.operation_update_failed"
    type = AgentMessageType.STEERING
    text = 'worker:{worker} update failed and changed nothing: output {output}'
    turn_limited = False
    wakes_agent = True

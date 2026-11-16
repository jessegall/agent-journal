from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerOperationMergedMessage(MessageTemplate):
    """The agent message workers.operation_merged."""

    key = "workers.operation_merged"
    type = AgentMessageType.STEERING
    text = 'worker:{worker} merged: output {output}'
    turn_limited = False
    wakes_agent = True

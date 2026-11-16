from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerOperationConflictMessage(MessageTemplate):
    """The agent message workers.operation_conflict."""

    key = "workers.operation_conflict"
    type = AgentMessageType.STEERING
    text = 'worker:{worker} has a merge conflict: output {output}'
    turn_limited = False
    wakes_agent = True

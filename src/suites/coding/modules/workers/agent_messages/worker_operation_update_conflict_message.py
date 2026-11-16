from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerOperationUpdateConflictMessage(MessageTemplate):
    """The agent message workers.operation_update_conflict."""

    key = "workers.operation_update_conflict"
    type = AgentMessageType.STEERING
    text = 'worker:{worker} update clashes: output {output}; settle the conflict markers, then commit'
    turn_limited = False
    wakes_agent = True

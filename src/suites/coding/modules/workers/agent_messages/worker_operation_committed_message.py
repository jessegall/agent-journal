from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerOperationCommittedMessage(MessageTemplate):
    """The agent message workers.operation_committed."""

    key = "workers.operation_committed"
    type = AgentMessageType.STEERING
    text = 'worker:{worker} committed its work: output {output}'
    turn_limited = False
    wakes_agent = True

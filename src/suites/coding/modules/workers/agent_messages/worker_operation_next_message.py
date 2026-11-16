from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerOperationNextMessage(MessageTemplate):
    """The agent message workers.operation_next."""

    key = "workers.operation_next"
    type = AgentMessageType.STEERING
    text = 'task:{task} is yours next; output {output}'
    turn_limited = False
    wakes_agent = True

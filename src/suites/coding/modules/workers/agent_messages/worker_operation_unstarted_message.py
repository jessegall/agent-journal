from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerOperationUnstartedMessage(MessageTemplate):
    """The agent message workers.operation_never_started."""

    key = "workers.operation_never_started"
    type = AgentMessageType.STEERING
    text = "Worker command never started and changed nothing: give it again; output {output}"
    turn_limited = False
    wakes_agent = True

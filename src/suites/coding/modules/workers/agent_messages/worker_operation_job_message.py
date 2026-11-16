from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerOperationJobMessage(MessageTemplate):
    """The agent message workers.operation_job."""

    key = "workers.operation_job"
    type = AgentMessageType.STEERING
    text = 'worker:{worker} has the job: output {output}'
    turn_limited = False
    wakes_agent = True

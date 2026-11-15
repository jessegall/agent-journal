from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerProgramResumedMessage(MessageTemplate):
    """The agent message workers.program_back."""

    key = "workers.program_back"
    type = AgentMessageType.STEERING
    text = "worker:{worker} resumed"
    turn_limited = False

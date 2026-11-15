from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerProgramUnavailableMessage(MessageTemplate):
    """The agent message workers.program_out."""

    key = "workers.program_out"
    type = AgentMessageType.STEERING
    text = "worker:{worker} stopped"
    turn_limited = False
    wakes_agent = True

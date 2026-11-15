from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerProofShortMessage(MessageTemplate):
    """The agent message workers.proof_short."""

    key = "workers.proof_short"
    type = AgentMessageType.STEERING
    text = "proof:{proof} of task:{task} is too short: read it, fix it, show it again and commit"
    turn_limited = False

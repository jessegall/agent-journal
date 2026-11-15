from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ProofWaitsMessage(MessageTemplate):
    """The nudge workers.proof_waits."""

    key = "workers.proof_waits"
    type = AgentMessageType.STEERING
    text = 'worker:{worker} waits on your check, proofs {proofs}'
    turn_limited = False
    wakes_agent = True

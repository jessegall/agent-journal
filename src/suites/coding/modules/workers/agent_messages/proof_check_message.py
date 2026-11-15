from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ProofCheckMessage(MessageTemplate):
    """The nudge workers.check_the_proof."""

    key = "workers.check_the_proof"
    type = AgentMessageType.REFUSAL
    text = "worker:{worker} committed task:{task}, proofs {proofs}: check them"

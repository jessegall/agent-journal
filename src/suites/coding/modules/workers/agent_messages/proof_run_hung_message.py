from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ProofRunHungMessage(MessageTemplate):
    """The agent message workers.proof_run_stuck."""

    key = "workers.proof_run_stuck"
    type = AgentMessageType.STEERING
    text = 'worker:{worker} proof {proof}: the test run went past {minutes} minutes and was ended as stuck, output {output}'
    turn_limited = False
    wakes_agent = True

from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnstartedProofsMessage(MessageTemplate):
    """The nudge workers.proofs_not_started."""

    key = "workers.proofs_not_started"
    type = AgentMessageType.STEERING
    text = "Proofs {proofs} are queued {minutes} min and not started; last error of the tick: {exception}"
    turn_limited = False
    wakes_agent = True

from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SkipApprovalMessage(MessageTemplate):
    """The nudge drivers.skip_waits_for_approval."""

    key = "drivers.skip_waits_for_approval"
    type = AgentMessageType.STEERING
    text = "agent:{agent} confirmed a skip that needs your answer: refusal-skip:{refusal}"
    turn_limited = False

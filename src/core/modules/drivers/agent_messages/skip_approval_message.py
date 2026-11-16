from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SkipApprovalMessage(MessageTemplate):
    """The agent message drivers.skip_waits_for_approval."""

    key = "drivers.skip_waits_for_approval"
    type = AgentMessageType.STEERING
    text = "agent:{agent} confirmed a skip that needs your answer: driver-grant:{refusal}"
    turn_limited = False

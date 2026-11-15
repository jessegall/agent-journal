from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ApprovalDecidedMessage(MessageTemplate):
    """The nudge approvals.decided."""

    key = "approvals.decided"
    type = AgentMessageType.NOTICE
    text = "Approval {approval} is decided"
    turn_limited = False
    wakes_agent = True

from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ApprovalFailedMessage(MessageTemplate):
    """The nudge approvals.failed."""

    key = "approvals.failed"
    type = AgentMessageType.NOTICE
    text = "Approval {approval} was accepted but its action failed: its row says why; ask again to retry"
    turn_limited = False
    wakes_agent = True

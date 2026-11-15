from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ApprovalPendingMessage(MessageTemplate):
    """The nudge approvals.asked."""

    key = "approvals.asked"
    type = AgentMessageType.NOTICE
    text = "Approval {approval} was sent to a user"
    plural_text = "A user was asked for {count} approvals"
    id_field = "approval"
    turn_limited = False

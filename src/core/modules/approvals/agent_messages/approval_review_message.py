from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ApprovalReviewMessage(MessageTemplate):
    """The nudge approvals.review."""

    key = "approvals.review"
    type = AgentMessageType.NOTICE
    text = "Approval {approval} needs your review"
    plural_text = "{count} approvals need your review"
    id_field = "approval"
    turn_limited = False

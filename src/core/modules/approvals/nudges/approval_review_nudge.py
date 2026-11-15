from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ApprovalReviewNudge(NudgeDeclaration):
    """The nudge approvals.review."""

    key = "approvals.review"
    type = NudgeType.NOTICE
    text = "Approval {approval} needs your review"
    plural_text = "{count} approvals need your review"
    id_field = "approval"
    turn_limited = False

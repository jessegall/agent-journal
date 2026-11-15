from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ApprovalPendingNudge(NudgeDeclaration):
    """The nudge approvals.asked."""

    key = "approvals.asked"
    type = NudgeType.NOTICE
    text = "Approval {approval} was sent to a user"
    plural_text = "A user was asked for {count} approvals"
    id_field = "approval"
    turn_limited = False

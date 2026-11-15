from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ApprovalDecidedNudge(NudgeDeclaration):
    """The nudge approvals.decided."""

    key = "approvals.decided"
    type = NudgeType.NOTICE
    text = "Approval {approval} is decided"
    turn_limited = False
    wakes_agent = True

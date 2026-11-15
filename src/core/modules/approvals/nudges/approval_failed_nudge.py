from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ApprovalFailedNudge(NudgeDeclaration):
    """The nudge approvals.failed."""

    key = "approvals.failed"
    type = NudgeType.NOTICE
    text = "Approval {approval} was accepted but its action failed: its row says why; ask again to retry"
    turn_limited = False
    wakes_agent = True

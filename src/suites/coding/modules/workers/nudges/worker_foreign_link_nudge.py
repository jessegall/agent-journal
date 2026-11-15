from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerForeignLinkNudge(NudgeDeclaration):
    """The nudge workers.outside_link."""

    key = "workers.outside_link"
    type = NudgeType.REFUSAL
    text = "Links from outside your worktree are refused: report what is missing to your main agent"
    turn_limited = False

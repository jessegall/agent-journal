from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MissedLogNudge(NudgeDeclaration):
    """The nudge tasks.missed_log."""

    key = "tasks.missed_log"
    type = NudgeType.STEERING
    text = "Log what the summary missed"

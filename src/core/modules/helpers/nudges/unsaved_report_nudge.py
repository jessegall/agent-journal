from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnsavedReportNudge(NudgeDeclaration):
    """The nudge helpers.unsaved-report: a hand-in whose save failed refuses the stop once (doc 1310 section 4.9)."""

    key = "helpers.unsaved-report"
    type = NudgeType.STEERING
    text = "Your hand-in was not saved: stop again."

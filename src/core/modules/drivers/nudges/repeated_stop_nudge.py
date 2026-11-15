from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class RepeatedStopNudge(NudgeDeclaration):
    """The nudge drivers.repeated_stop."""

    key = "drivers.repeated_stop"
    type = NudgeType.STEERING
    text = "Your stop was refused 5 times in a row: report what is holding it"

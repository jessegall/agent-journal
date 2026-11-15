from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class HandMadeMonitorNudge(NudgeDeclaration):
    """The nudge processes.hand_made_monitor."""

    key = "processes.hand_made_monitor"
    type = NudgeType.REFUSAL
    text = "Do not write your own wait on an output: give the output wait to the Monitor"

from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class FreezeLiftedNudge(NudgeDeclaration):
    """The nudge processes.hold_lifted."""

    key = "processes.hold_lifted"
    type = NudgeType.STEERING
    text = "A user lifted the hold on output {output}"

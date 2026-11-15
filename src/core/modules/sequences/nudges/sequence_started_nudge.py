from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SequenceStartedNudge(NudgeDeclaration):
    """The nudge sequences.started."""

    key = "sequences.started"
    type = NudgeType.STEERING
    text = "sequence:{sequence} was started by what just happened"

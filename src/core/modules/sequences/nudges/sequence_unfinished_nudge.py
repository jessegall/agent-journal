from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SequenceUnfinishedNudge(NudgeDeclaration):
    """The nudge sequences.unfinished_at_stop."""

    key = "sequences.unfinished_at_stop"
    type = NudgeType.REFUSAL
    text = "sequence:{sequence} step {step} is not finished: finish it before you stop"

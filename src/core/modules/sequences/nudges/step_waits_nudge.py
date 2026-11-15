from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class StepWaitsNudge(NudgeDeclaration):
    """The nudge sequences.step_waits."""

    key = "sequences.step_waits"
    type = NudgeType.REFUSAL
    text = "sequence:{sequence} step {step} is waiting"

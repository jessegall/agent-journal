from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class StepEditBanNudge(NudgeDeclaration):
    """The nudge sequences.step_holds_edits."""

    key = "sequences.step_holds_edits"
    type = NudgeType.REFUSAL
    text = "Step {step} of sequence:{sequence} blocks file edits"

from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class StepRefusesCommandNudge(NudgeDeclaration):
    """The nudge sequences.step_refuses_command."""

    key = "sequences.step_refuses_command"
    type = NudgeType.REFUSAL
    text = "Step {step} of sequence:{sequence} does not allow this command"

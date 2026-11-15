from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MainCodeEditRefusedNudge(NudgeDeclaration):
    """The nudge coding.main_writes_no_code."""

    key = "coding.main_writes_no_code"
    type = NudgeType.REFUSAL
    text = "The main agent writes no code here: send the work to a worker"

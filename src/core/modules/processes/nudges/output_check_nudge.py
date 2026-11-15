from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class OutputCheckNudge(NudgeDeclaration):
    """The nudge processes.output_check."""

    key = "processes.output_check"
    type = NudgeType.STEERING
    text = "Output {output} has run {minutes} min: check it is doing its work"
    required_command = "journal output confirm {output}"
    wakes_agent = True
    turn_limited = False

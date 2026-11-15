from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class HelperProgramFaultNudge(NudgeDeclaration):
    """The nudge helpers.program_fault."""

    key = "helpers.program_fault"
    type = NudgeType.STEERING
    text = "agent:{agent} program exited with code {code}: check its output"
    turn_limited = False

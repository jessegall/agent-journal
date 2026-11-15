from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class OutputProgressNudge(NudgeDeclaration):
    """The nudge processes.output_progress."""

    key = "processes.output_progress"
    type = NudgeType.STEERING
    text = "Output {output}: {percent}%"

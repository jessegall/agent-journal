from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class OutputRunningNudge(NudgeDeclaration):
    """The nudge processes.output_running."""

    key = "processes.output_running"
    type = NudgeType.STEERING
    text = "Output {output}: running"

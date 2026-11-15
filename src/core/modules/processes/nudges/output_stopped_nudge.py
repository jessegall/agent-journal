from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class OutputStoppedNudge(NudgeDeclaration):
    """The nudge processes.output_stopped."""

    key = "processes.output_stopped"
    type = NudgeType.STEERING
    text = "Output {output} was stopped partway: its output is kept, read what it printed so far"

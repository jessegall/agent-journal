from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnreadableEmptyNudge(NudgeDeclaration):
    """The nudge processes.unreadable_empty."""

    key = "processes.unreadable_empty"
    type = NudgeType.STEERING
    text = "Output {output} printed nothing: its exit code is the result, so no reader is needed"

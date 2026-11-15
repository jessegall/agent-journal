from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnreadableSingleLineNudge(NudgeDeclaration):
    """The nudge processes.unreadable_single_line."""

    key = "processes.unreadable_single_line"
    type = NudgeType.STEERING
    text = "Output {output} is one redrawn line: read it with a script reader that splits on carriage returns, or mark it unreadable"

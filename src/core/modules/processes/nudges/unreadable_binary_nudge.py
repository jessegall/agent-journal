from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnreadableBinaryNudge(NudgeDeclaration):
    """The nudge processes.unreadable_binary."""

    key = "processes.unreadable_binary"
    type = NudgeType.STEERING
    text = "Output {output} is binary: use a tool made for it"

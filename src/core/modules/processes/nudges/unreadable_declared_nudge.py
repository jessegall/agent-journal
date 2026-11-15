from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnreadableDeclaredNudge(NudgeDeclaration):
    """The nudge processes.unreadable_declared."""

    key = "processes.unreadable_declared"
    type = NudgeType.STEERING
    text = "Command {name} was marked unreadable"

from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnreadableLiftedNudge(NudgeDeclaration):
    """The nudge processes.unreadable_lifted."""

    key = "processes.unreadable_lifted"
    type = NudgeType.STEERING
    text = "Command {name} prints readable lines again: reader requests resume"

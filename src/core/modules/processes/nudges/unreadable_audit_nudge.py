from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnreadableAuditNudge(NudgeDeclaration):
    """The nudge processes.unreadable_audit."""

    key = "processes.unreadable_audit"
    type = NudgeType.STEERING
    text = "{count} commands are marked unreadable by agents: review them in the viewer"

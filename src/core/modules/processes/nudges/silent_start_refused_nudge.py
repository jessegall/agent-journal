from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SilentStartRefusedNudge(NudgeDeclaration):
    """The nudge processes.silent_start_refused."""

    key = "processes.silent_start_refused"
    type = NudgeType.REFUSAL
    text = "{name} ran silent twice: add its reader, or skip once and say why no progress can be shown"

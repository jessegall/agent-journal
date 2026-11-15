from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SilentStartReadyNudge(NudgeDeclaration):
    """The nudge processes.silent_start_ready."""

    key = "processes.silent_start_ready"
    type = NudgeType.NOTICE
    text = "A reader for {name} fits shape {shape}: {reader}"
    path_fields = tuple(["reader"])

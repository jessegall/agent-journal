from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnreadableInteractiveNudge(NudgeDeclaration):
    """The nudge processes.unreadable_interactive."""

    key = "processes.unreadable_interactive"
    type = NudgeType.STEERING
    text = "Output {output} is waiting for input: stop it; no reader will be asked"

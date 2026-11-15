from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ProcessMissingNudge(NudgeDeclaration):
    """The nudge processes.process_lost."""

    key = "processes.process_lost"
    type = NudgeType.STEERING
    text = "Process {process} was lost: its shell is gone"

from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerProgramResumedNudge(NudgeDeclaration):
    """The nudge workers.program_back."""

    key = "workers.program_back"
    type = NudgeType.STEERING
    text = "worker:{worker} resumed"
    turn_limited = False

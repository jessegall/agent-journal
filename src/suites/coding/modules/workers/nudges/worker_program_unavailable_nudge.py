from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerProgramUnavailableNudge(NudgeDeclaration):
    """The nudge workers.program_out."""

    key = "workers.program_out"
    type = NudgeType.STEERING
    text = "worker:{worker} stopped"
    turn_limited = False
    wakes_agent = True

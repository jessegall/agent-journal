from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerUnitRunPassedNudge(NudgeDeclaration):
    """The nudge workers.unit_run_passed."""

    key = "workers.unit_run_passed"
    type = NudgeType.STEERING
    text = 'phase:{phase} tests passed on your commit: {line}'
    turn_limited = False
    wakes_agent = True
    path_fields = ["line"]

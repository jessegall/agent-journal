from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerTestsFailedNudge(NudgeDeclaration):
    """The nudge workers.tests_failed."""

    key = "workers.tests_failed"
    type = NudgeType.STEERING
    text = "Your tests failed, output {outputs}: {line}"
    turn_limited = False
    path_fields = ["line"]

from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerPhaseTestsFailedNudge(NudgeDeclaration):
    """The nudge workers.phase_tests_failed."""

    key = "workers.phase_tests_failed"
    type = NudgeType.STEERING
    text = 'phase:{phase} tests failed, output {outputs}: {line} Failed: {failed}'
    turn_limited = False
    id_field = "outputs"
    path_fields = ["line"]

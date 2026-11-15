from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerCommitPassedNudge(NudgeDeclaration):
    """The nudge workers.commit_tests_passed."""

    key = "workers.commit_tests_passed"
    type = NudgeType.STEERING
    text = "Your commit's tests passed: {line}"
    turn_limited = False
    path_fields = ["line"]

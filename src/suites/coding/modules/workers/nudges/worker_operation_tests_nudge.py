from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerOperationTestsNudge(NudgeDeclaration):
    """The nudge workers.operation_tests."""

    key = "workers.operation_tests"
    type = NudgeType.STEERING
    text = "task:{task} tests queued: this commit is done, so run tests yourself or stop; output {output}"
    turn_limited = False
    wakes_agent = True

from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerTestsPassedNudge(NudgeDeclaration):
    """The nudge workers.tests_passed."""

    key = "workers.tests_passed"
    type = NudgeType.STEERING
    text = "All tests of worker:{worker} pass"
    turn_limited = False
    plural_text = 'the tests of workers {worker} all pass'
    id_field = "worker"

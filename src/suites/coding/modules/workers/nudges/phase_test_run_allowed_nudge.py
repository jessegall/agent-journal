from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PhaseTestRunAllowedNudge(NudgeDeclaration):
    """The nudge workers.phase_test_run_allowed."""

    key = "workers.phase_test_run_allowed"
    type = NudgeType.STEERING
    text = "The journal tests your commit itself. Test runs left before your next commit: {remaining}"
    turn_limited = False

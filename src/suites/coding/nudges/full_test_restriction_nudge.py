from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class FullTestRestrictionNudge(NudgeDeclaration):
    """The nudge drivers.no_full_test_run."""

    key = "drivers.no_full_test_run"
    type = NudgeType.SAFETY_REFUSAL
    text = "Run only the tests of changed files: name the test files, not the full suite"
    turn_limited = False

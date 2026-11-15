from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class FailedFullRunNudge(NudgeDeclaration):
    """The nudge processes.failed_full_run."""

    key = "processes.failed_full_run"
    type = NudgeType.REFUSAL
    text = "Your last full test run failed: rerun the failed tests by name first"
    turn_limited = False

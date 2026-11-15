from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class RunnerStartFailedNudge(NudgeDeclaration):
    """The nudge processes.runner_start_failed."""

    key = "processes.runner_start_failed"
    type = NudgeType.STEERING
    text = "the journal could not start a run for this shell line, so it did not run: run it again"

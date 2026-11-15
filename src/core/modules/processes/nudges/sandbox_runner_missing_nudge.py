from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SandboxRunnerMissingNudge(NudgeDeclaration):
    """The nudge processes.sandbox_runner_missing."""

    key = "processes.sandbox_runner_missing"
    type = NudgeType.REFUSAL
    text = "The read-only sandbox needs journal-run: install the runner before running this line"

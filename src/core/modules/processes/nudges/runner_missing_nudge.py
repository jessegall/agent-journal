from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class RunnerMissingNudge(NudgeDeclaration):
    """The nudge processes.runner_missing."""

    key = "processes.runner_missing"
    type = NudgeType.STEERING
    text = "journal-run is not installed in {folder}: shell lines run as written and are not kept"

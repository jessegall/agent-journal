from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.enums.nudge_type import NudgeType
from core.modules.processes.nudges.silent_run_nudge import SILENT_RUN_INTERVAL


class SilentSavedFailureNudge(NudgeDeclaration):
    """The nudge processes.silent_saved_failure."""

    key = "processes.silent_saved_failure"
    type = NudgeType.STEERING
    text = "Saved command {name} failed without printing anything: fix its line"
    interval = Interval(SILENT_RUN_INTERVAL)

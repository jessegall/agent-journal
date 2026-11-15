from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.enums.nudge_type import NudgeType
from core.modules.processes.nudges.silent_run_nudge import SILENT_RUN_INTERVAL


class SilentSavedRunNudge(NudgeDeclaration):
    """The nudge processes.silent_saved_run."""

    key = "processes.silent_saved_run"
    type = NudgeType.NOTICE
    text = "Alias {name} printed nothing for {seconds}s: make it print each step. This run stays silent; the next shows its steps"
    interval = Interval(SILENT_RUN_INTERVAL)

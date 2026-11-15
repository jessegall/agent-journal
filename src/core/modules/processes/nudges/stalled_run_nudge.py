from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.enums.nudge_type import NudgeType
from core.modules.processes.nudges.silent_run_nudge import SILENT_RUN_INTERVAL


class StalledRunNudge(NudgeDeclaration):
    """The nudge processes.stalled_run."""

    key = "processes.stalled_run"
    type = NudgeType.NOTICE
    text = "Output {output} has written nothing for {seconds}s and is still running: {hint}"
    interval = Interval(SILENT_RUN_INTERVAL)

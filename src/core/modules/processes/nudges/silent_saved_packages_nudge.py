from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.enums.nudge_type import NudgeType
from core.modules.processes.nudges.silent_run_nudge import SILENT_RUN_INTERVAL


class SilentSavedPackagesNudge(NudgeDeclaration):
    """The nudge processes.silent_saved_packages."""

    key = "processes.silent_saved_packages"
    type = NudgeType.NOTICE
    text = "Alias {name} printed nothing for {seconds}s: go test holds each package's output until it is done, so run one package at a time or with -p 1. This run stays silent; the next shows its steps"
    interval = Interval(SILENT_RUN_INTERVAL)

from engine.driver.seconds import Seconds
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.enums.nudge_type import NudgeType

SILENT_RUN_INTERVAL = Seconds(600)


class SilentRunNudge(NudgeDeclaration):
    """The nudge processes.silent_run."""

    key = "processes.silent_run"
    type = NudgeType.NOTICE
    text = "Output {output} printed nothing for {seconds}s, so it is not streaming: {hint}"
    interval = Interval(SILENT_RUN_INTERVAL)

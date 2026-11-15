from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class WorkerRunRunsAfterStopNudge(NudgeDeclaration):
    """The nudge workers.run_outlasts."""

    key = "workers.run_outlasts"
    type = NudgeType.STEERING
    text = "worker:{worker} stopped but output {output} is still running: stop that output"
    interval = Interval(Seconds(600))
    turn_limited = False
    wakes_agent = True

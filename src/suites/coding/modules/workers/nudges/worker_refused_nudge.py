from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

WORKER_REFUSAL_INTERVAL = Interval(Seconds(600))


class WorkerRefusedNudge(NudgeDeclaration):
    """The nudge workers.repeated_refusal."""

    key = "workers.repeated_refusal"
    type = NudgeType.STEERING
    text = "worker:{worker} hit {count} refusals on task:{task}: check what is blocking it"
    interval = WORKER_REFUSAL_INTERVAL
    turn_limited = False

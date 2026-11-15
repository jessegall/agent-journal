from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerLimitRaisedNudge(NudgeDeclaration):
    """The nudge workers.limit_raised."""

    key = "workers.limit_raised"
    type = NudgeType.STEERING
    text = "Worker limit is now {limit}: {workers} out, {count} open tasks not delegated: hand out more"
    turn_limited = False

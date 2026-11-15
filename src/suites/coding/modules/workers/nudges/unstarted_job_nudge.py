from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnstartedJobNudge(NudgeDeclaration):
    """The nudge workers.job_not_started."""

    key = "workers.job_not_started"
    type = NudgeType.STEERING
    text = "{name}:{agent} has had work waiting for {minutes} min and has not started: {action}"
    turn_limited = False
    wakes_agent = True

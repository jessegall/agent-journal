from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerHelpRequestNudge(NudgeDeclaration):
    """The nudge workers.help-request."""

    key = "workers.help-request"
    type = NudgeType.STEERING
    text = 'worker:{worker} is stuck on {tasks}, wait:{wait}: send it a job'
    turn_limited = False
    wakes_agent = True

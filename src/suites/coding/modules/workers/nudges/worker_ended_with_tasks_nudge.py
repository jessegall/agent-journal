from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerEndedWithTasksNudge(NudgeDeclaration):
    """The nudge workers.ended_with_tasks."""

    key = "workers.ended_with_tasks"
    type = NudgeType.STEERING
    text = "worker:{worker} ended with {tasks} left: send it a job, or release them"
    turn_limited = False
    wakes_agent = True

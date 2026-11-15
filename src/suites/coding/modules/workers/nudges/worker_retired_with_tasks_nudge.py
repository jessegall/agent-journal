from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerRetiredWithTasksNudge(NudgeDeclaration):
    """The nudge workers.retired_with_tasks."""

    key = "workers.retired_with_tasks"
    type = NudgeType.STEERING
    text = 'worker:{worker} was retired with {tasks} left: give them to another worker'
    turn_limited = False
    wakes_agent = True

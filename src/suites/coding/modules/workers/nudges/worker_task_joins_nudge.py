from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerTaskJoinsNudge(NudgeDeclaration):
    """The nudge workers.task_joins_unit."""

    key = "workers.task_joins_unit"
    type = NudgeType.STEERING
    text = "task:{task} joins your unit; to merge it early, commit it and ask with --up-to {task}"
    turn_limited = False
    id_field = "task"

from engine.command.context import Context
from engine.event.created import Created
from engine.guard.guard import Guard
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.plans.support.wait_circle import TARGET_TYPES, TASK, WaitCircle
from core.modules.plans.support.wait_node import WaitNode

class TaskWaitCircleGuard(Guard[Created[TaskWait]]):
    """Refuses a task's wait on a task or a plan that comes back, through other waits, to the task itself."""

    name = "plans.task-wait-circle"
    is_safety = True

    def __init__(self, circle: WaitCircle) -> None:
        self.circle = circle

    def check(self, event: Created[TaskWait], context: Context) -> None:
        wait = event.row
        target_type, _, row_id = wait.target.partition(":")
        if not row_id.isdigit() or target_type not in TARGET_TYPES:
            return
        self.circle.refuse_circle(WaitNode(TASK, wait.task_id), WaitNode(TARGET_TYPES[target_type], int(row_id)))

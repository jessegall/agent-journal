from engine.command.context import Context
from engine.event.created import Created
from engine.guard.guard import Guard
from core.modules.tasks.models.task_dependency import TaskDependency
from core.modules.plans.support.wait_circle import TASK, WaitCircle
from core.modules.plans.support.wait_node import WaitNode

class TaskDependencyCircleGuard(Guard[Created[TaskDependency]]):
    """Refuses a dependency that would make a task wait, through other tasks and plans, on itself."""

    name = "plans.task-dependency-circle"
    is_safety = True

    def __init__(self, circle: WaitCircle) -> None:
        self.circle = circle

    def check(self, event: Created[TaskDependency], context: Context) -> None:
        dependency = event.row
        self.circle.refuse_circle(WaitNode(TASK, dependency.task_id), WaitNode(TASK, dependency.dependency_id))

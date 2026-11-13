from core.modules.assignments.support.assignments import Assignments
from engine.enums.actor_type import ActorType
from engine.event.moved import Moved
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.assignee_label import AssigneeLabel


class AssignedTaskStartGuard(Guard[Moved[Task]]):
    """An agent starts only a task assigned to nobody or to itself; a user starts any task."""

    name = "tasks.assigned-task-start"
    moves = tuple([TaskLifecycle.start])

    def __init__(self, assignments: Assignments, labels: AssigneeLabel) -> None:
        self.assignments, self.labels = assignments, labels

    def check(self, event: Moved[Task], context: Context) -> None:
        task = event.row
        if context.actor.type is not ActorType.AGENT:
            return
        assignee_id = self.assignments.actor(task)
        if assignee_id is None or assignee_id == context.actor.id:
            return
        raise Refusal(f"task {task.id} is assigned to {self.labels.text(assignee_id)}", f"journal task assign {task.id} --to <agent> moves it")

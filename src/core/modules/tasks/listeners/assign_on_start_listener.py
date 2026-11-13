from engine.command.context import Context
from engine.event.moved import Moved
from engine.listener.save_listener import SaveListener
from core.modules.assignments.support.assignments import Assignments
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task


class AssignOnStartListener(SaveListener[Moved[Task]]):
    """A user or an agent that starts a task nobody is assigned becomes its assignee. A task already assigned
    keeps its assignee, also when a user starts it for someone else."""

    name = "tasks.assign-on-start"
    moves = tuple([TaskLifecycle.start])

    def __init__(self, assignments: Assignments) -> None:
        self.assignments = assignments

    def handle(self, event: Moved[Task], context: Context) -> None:
        if not context.actor.type.can_receive_work or self.assignments.actors(event.row):
            return
        self.assignments.assign(event.row, context.actor.id, context, cascade=False)

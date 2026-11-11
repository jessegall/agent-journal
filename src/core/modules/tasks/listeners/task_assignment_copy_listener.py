from engine.command.context import Context
from engine.event.changed import Changed
from engine.event.deleted import Deleted
from engine.listener.save_listener import SaveListener
from core.modules.assignments.support.assignments import Assignments
from core.modules.tasks.models.task import Task


# Deleted in phase 8 of plan 1104 (task 8.6), once every writer writes the assignments table itself.
class TaskAssignmentCopyListener(SaveListener[Changed[Task]]):
    """While the column delegated_to still exists, the assignment of a task is kept equal to it: the agent in
    the column holds the task, and an empty column leaves it unassigned."""

    name = "tasks.assignment-copy"

    def __init__(self, assignments: Assignments) -> None:
        self.assignments = assignments

    def handle(self, event: Changed[Task], context: Context) -> None:
        if not isinstance(event, Deleted):
            self.assignments.copy_actor(event.row, event.row.delegated_to, context)

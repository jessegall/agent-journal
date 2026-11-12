from engine.command.context import Context
from engine.event.changed import Changed
from engine.event.deleted import Deleted
from engine.listener.save_listener import SaveListener
from core.modules.assignments.support.assignments import Assignments
from core.modules.tasks.models.task import Task


# Deleted in phase 8 of plan 1104 (task 8.6), once every writer writes the assignments table itself.
class TaskAssignmentCopyListener(SaveListener[Changed[Task]]):
    """While the column delegated_to still exists, the assignment of a task follows it: when the column
    changes, the agent now in it holds the task, and an emptied column leaves the task unassigned. A change
    of a task that leaves the column as it was leaves its assignment as it was, also one given to a user."""

    name = "tasks.assignment-copy"

    def __init__(self, assignments: Assignments) -> None:
        self.assignments = assignments

    def handle(self, event: Changed[Task], context: Context) -> None:
        if isinstance(event, Deleted):
            return
        previous_actor_id = None if event.old_row is None else event.old_row.delegated_to
        if event.row.delegated_to != previous_actor_id:
            self.assignments.copy_actor(event.row, event.row.delegated_to, context)

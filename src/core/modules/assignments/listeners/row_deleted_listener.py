from engine.command.context import Context
from engine.event.deleted import Deleted
from engine.listener.save_listener import SaveListener
from engine.model.assignable import Assignable
from core.modules.assignments.support.assignments import Assignments


class RowDeletedListener(SaveListener[Deleted[Assignable]]):
    """When a row of an assignable model is deleted, its assignments are deleted with it, each as an event of
    its own."""

    name = "assignments.row-deleted"

    def __init__(self, assignments: Assignments) -> None:
        self.assignments = assignments

    def handle(self, event: Deleted[Assignable], context: Context) -> None:
        self.assignments.unassign(event.row, context)

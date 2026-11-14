from engine.command.context import Context
from engine.event.created import Created
from engine.listener.save_listener import SaveListener
from engine.model.assignment_link import AssignmentLink
from core.modules.assignments.support.assignable_rows import AssignableRows
from core.modules.assignments.support.assignments import Assignments


class LinkCreatedListener(SaveListener[Created[AssignmentLink]]):
    """A child linked to an assigned parent inherits the parent's assignment when it has none of its own."""

    name = "assignments.link-created"

    def __init__(self, assignments: Assignments, rows: AssignableRows) -> None:
        self.assignments, self.rows = assignments, rows

    def handle(self, event: Created[AssignmentLink], context: Context) -> None:
        for linked in self.rows.linked(event.row):
            self.assignments.follow_parents(linked.child, [linked.parent], context)

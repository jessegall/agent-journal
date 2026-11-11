from engine.command.context import Context
from engine.event.deleted import Deleted
from engine.listener.save_listener import SaveListener
from engine.model.assignment_link import AssignmentLink
from core.modules.assignments.support.assignable_rows import AssignableRows
from core.modules.assignments.support.assignments import Assignments


class LinkRemovedListener(SaveListener[Deleted[AssignmentLink]]):
    """A child whose link to a parent is removed loses the assignment it inherited from that parent and keeps one
    given by hand. A child moved to another parent loses its link and gains one, so it follows the new parent."""

    name = "assignments.link-removed"

    def __init__(self, assignments: Assignments, rows: AssignableRows) -> None:
        self.assignments, self.rows = assignments, rows

    def handle(self, event: Deleted[AssignmentLink], context: Context) -> None:
        for linked in self.rows.linked(event.row):
            self.assignments.leave_parent(linked.parent, linked.child, context)

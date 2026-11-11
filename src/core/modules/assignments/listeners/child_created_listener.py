from engine.command.context import Context
from engine.event.created import Created
from engine.listener.save_listener import SaveListener
from engine.model.assignable import Assignable
from core.modules.assignments.support.assignments import Assignments


class ChildCreatedListener(SaveListener[Created[Assignable]]):
    """A row made under an assigned parent inherits the parent's assignment when it has none of its own."""

    name = "assignments.child-created"

    def __init__(self, assignments: Assignments) -> None:
        self.assignments = assignments

    def handle(self, event: Created[Assignable], context: Context) -> None:
        self.assignments.follow_parent(event.row, context)

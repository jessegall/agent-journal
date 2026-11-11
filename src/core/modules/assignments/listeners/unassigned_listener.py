from typing import ClassVar

from engine.command.context import Context
from engine.event.deleted import Deleted
from engine.listener.event_rows import EventRows
from engine.listener.save_listener import SaveListener
from engine.model.assignable import Assignable
from core.modules.assignments.errors.listener_subject_error import ListenerSubjectError
from core.modules.assignments.models.assignment import Assignment


class UnassignedListener(SaveListener[Deleted[Assignment]]):
    """The base of a listener that runs when a row of one assignable model is taken from an actor. A subclass
    names the model as its subject and is handed the row and the actor. A row that passes from one actor to the
    next is taken from the first and then given to the second."""

    subject: ClassVar[type[Assignable]]

    def __init_subclass__(cls, **options: object) -> None:
        super().__init_subclass__(**options)
        if not hasattr(cls, "subject"):
            raise ListenerSubjectError(cls.__name__)

    def __init__(self, rows: EventRows) -> None:
        self.rows = rows

    def handle(self, event: Deleted[Assignment], context: Context) -> None:
        if event.row.subject_model == self.subject.model_name:
            self.unassigned(self.rows.required(self.subject, event.row.subject_id), event.row.actor_id, context)

    def unassigned(self, row: Assignable, actor_id: int, context: Context) -> None:
        raise NotImplementedError

from engine.command.context import Context
from engine.event.created import Created
from engine.listener.save_listener import SaveListener
from engine.model.assignable import Assignable
from core.modules.assignments.support.listener_subject import ListenerSubject
from core.modules.assignments.models.assignment import Assignment


class AssignedListener(ListenerSubject, SaveListener[Created[Assignment]]):
    """The base of a listener that runs when a row of one assignable model is given to an actor. A subclass names
    the model as its subject and is handed the row and the actor."""

    def handle(self, event: Created[Assignment], context: Context) -> None:
        if event.row.subject_model == self.subject.model_name:
            self.assigned(self.rows.required(self.subject, event.row.subject_id), event.row.actor_id, context)

    def assigned(self, row: Assignable, actor_id: int, context: Context) -> None:
        raise NotImplementedError

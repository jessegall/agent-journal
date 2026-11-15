from engine.command.context import Context
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from core.modules.drivers.models.permission_request import PermissionRequest
from core.modules.drivers.support.answer_basis_writers import AnswerBasisWriters


class PermissionRequestBasisListener(SaveListener[Changed[PermissionRequest]]):
    """A permission asked, allowed, declined or used changes what its asker may do: its answer basis moves in the
    same write."""

    name = "drivers.permission-request-basis"

    def __init__(self, writers: AnswerBasisWriters) -> None:
        self.writers = writers

    def handle(self, event: Changed[PermissionRequest], context: Context) -> None:
        self.writers.bump_agent(event.row.asker_id, context)

from engine.command.context import Context
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from core.modules.drivers.support.answer_basis_writers import AnswerBasisWriters
from core.modules.helpers.models.helper_grant import HelperGrant


class HelperGrantBasisListener(SaveListener[Changed[HelperGrant]]):
    """A grant given to a helper, changed or taken away changes what it may run: its answer basis moves in the same
    write (doc 1310 section 6.5)."""

    name = "helpers.grant-basis"

    def __init__(self, writers: AnswerBasisWriters) -> None:
        self.writers = writers

    def handle(self, event: Changed[HelperGrant], context: Context) -> None:
        self.writers.bump_agent(event.row.helper_id, context)

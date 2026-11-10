from engine.guard.guard import Guard
from engine.repository.standard_rows import StandardRows
from core.base.change.changed import Changed
from engine.command.context import Context
from core.modules.sequences.models.sequence import Sequence


class StandardSequenceGuard(Guard[Changed[Sequence]]):
    """Refuses a change to a sequence that comes with the journal: each start writes it again."""

    name = "sequences.standard-is-locked"

    def check(self, event: Changed[Sequence], context: Context) -> None:
        StandardRows.refuse_change(event.old_row, context.actor)

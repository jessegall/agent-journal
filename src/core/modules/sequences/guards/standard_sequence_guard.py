from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.repository.standard_rows import StandardRows


class StandardSequenceGuard(Guard):
    """Refuses a change to a sequence that comes with the journal: each start writes it again."""

    name = "sequences.standard-is-locked"
    event = "sequence.*"

    def check(self, change: Change[Model]) -> None:
        StandardRows.refuse_change(change)

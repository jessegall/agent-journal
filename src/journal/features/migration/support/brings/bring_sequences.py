from journal.features.migration.support.shipped_kind import ShippedKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.sequence import Sequence
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.sequences import Sequences


class BringSequences(ShippedKind):
    """A sequence of the project's keeps its title, its steps in order and when it starts."""

    kind = "sequence"
    title = "sequences"

    def __init__(self, ledger: MigratedRows, sequences: Sequences) -> None:
        super().__init__(ledger)
        self.sequences = sequences

    def made(self, row: Version3Row, actor: Actor) -> Sequence:
        steps = tuple(f"{title}: {body}" if body else title for title, body in row.sections)
        return self.sequences.imported(Sequence(title=row.title, steps=steps, starts_on=row.data.get("starts_on", "")), row.made_at(), actor)

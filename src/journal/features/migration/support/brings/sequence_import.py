from journal.features.migration.support.builtin_kind import BuiltinKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.sequence import Sequence
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.sequences import Sequences


class SequenceImport(BuiltinKind):
    """A sequence of the project's keeps its title, its steps in order and when it starts."""

    kind = "sequence"
    title = "sequences"

    def __init__(self, tally: MigratedRows, sequences: Sequences) -> None:
        super().__init__(tally)
        self.sequences = sequences

    def created(self, row: Version3Row, actor: Actor) -> Sequence:
        steps = tuple(f"{title}: {body}" if body else title for title, body in row.sections)
        return self.sequences.imported(Sequence(title=row.title, steps=steps, trigger_event=row.data.get("starts_on", "")), row.created_at(), actor)

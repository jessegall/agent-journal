from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.modules.sequences.models.sequence import Sequence


class SequenceRows:
    """Keeps sequence definitions until the sequences table changes."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def rows(self) -> tuple[Sequence, ...]:
        return self.kept.read("sequences", self.load)

    def load(self) -> tuple[Sequence, ...]:
        return tuple(self.queries.query(Sequence).all_rows())

from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.support.sequence_event_index import SequenceEventIndex
from core.modules.sequences.support.triggered_sequence import TriggeredSequence


class SequenceEvents:
    """Keeps the sequences that start or end on each event until their table changes."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def matching(self, event: str) -> tuple[TriggeredSequence, ...]:
        return self.index().starts.get(event, ())

    def ending(self, event: str) -> frozenset[int]:
        return self.index().ends.get(event, frozenset())

    def index(self) -> SequenceEventIndex:
        return self.kept.read("sequences", self.load, name="sequences.event-index")

    def load(self) -> SequenceEventIndex:
        return SequenceEventIndex.built(self.queries.query(Sequence).all_rows())

    def remember(self, sequence: Sequence) -> None:
        def saved(index: SequenceEventIndex) -> SequenceEventIndex:
            return index.saved(sequence)

        self.kept.update("sequences", saved, name="sequences.event-index")

    def remove(self, sequence_id: int) -> None:
        def removed(index: SequenceEventIndex) -> SequenceEventIndex:
            return index.removed(sequence_id)

        self.kept.update("sequences", removed, name="sequences.event-index")

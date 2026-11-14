from engine.database.database import Database
from engine.database.kept_rows import KeptRows
from engine.model.tables import Tables
from engine.query.conditions.equal import Equal
from engine.query.query import Query
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.support.sequence_guard import SequenceGuard
from core.modules.sequences.models.support.sequence_guards import SequenceGuards
from core.modules.sequences.models.support.sequence_trigger_list import SequenceTriggerList
from core.modules.sequences.models.support.sequence_triggers import SequenceTriggers

EMPTY_TRIGGERS = "[]"


class SequenceQuery(Query[Sequence]):
    """Reads what a hook asks of the sequences, their triggers and step guards, parsed and kept until the
    sequences table changes."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, Sequence)
        self.kept = kept

    def trigger_lists(self) -> tuple[SequenceTriggerList, ...]:
        return self.kept.read(self.oldest(), self.load_trigger_lists, name="sequences.trigger_lists")

    def load_trigger_lists(self) -> tuple[SequenceTriggerList, ...]:
        triggered = self.matching(Equal("triggers", EMPTY_TRIGGERS, negated=True))
        return tuple(SequenceTriggerList(sequence.id, SequenceTriggers.parsed(sequence.triggers)) for sequence in triggered.get())

    def step_guard(self, sequence_id: int, step_number: int) -> SequenceGuard:
        return SequenceGuards.picked(self.step_guards()[sequence_id], step_number)

    def step_guards(self) -> dict[int, tuple[SequenceGuard, ...]]:
        return self.kept.read(self.oldest(), self.load_step_guards, name="sequences.step_guards")

    def load_step_guards(self) -> dict[int, tuple[SequenceGuard, ...]]:
        return {sequence.id: SequenceGuards.parsed(sequence.step_guards) for sequence in self.get()}

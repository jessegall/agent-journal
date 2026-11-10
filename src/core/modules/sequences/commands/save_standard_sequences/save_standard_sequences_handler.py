from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.standard_rows import StandardRows
from core.modules.sequences.commands.save_standard_sequences.save_standard_sequences import SaveStandardSequences
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.sequence_run import SequenceRun
from core.modules.sequences.commands.save_standard_sequences.standard_sequences import STANDARD_SEQUENCE_FIELDS, STANDARD_SEQUENCES


class SaveStandardSequencesHandler(Handler[SaveStandardSequences, None]):
    """Writes the sequences the journal ships; one no longer shipped stays while a run still names it."""

    command = SaveStandardSequences

    def __init__(self, queries: Queries, standard: StandardRows) -> None:
        self.queries, self.standard = queries, standard

    def handle(self, command: SaveStandardSequences, context: Context) -> None:
        self.standard.save_all(Sequence, STANDARD_SEQUENCES, STANDARD_SEQUENCE_FIELDS, context, self.has_run)

    def has_run(self, sequence: Sequence) -> bool:
        return bool(tuple(self.queries.query(SequenceRun).filter(sequence_id=sequence.id).all_rows()))

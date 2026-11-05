from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.modules.sequences.models.sequence import Sequence


class SequenceQuery(Query[Sequence]):
    """Reads sequence definitions and keeps them until the sequences table changes."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, Sequence)
        self.kept = kept

    def definitions(self) -> tuple[Sequence, ...]:
        return self.kept.read("sequences", self.load_definitions, name="sequences.definitions")

    def load_definitions(self) -> tuple[Sequence, ...]:
        return tuple(self.all_rows())

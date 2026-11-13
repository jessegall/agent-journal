from collections.abc import Sequence
from typing import Self

from engine.database.database import Database
from engine.model.tables import Tables
from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.query.query import Query
from engine.time.timestamp import Timestamp
from core.modules.processes.models.unreadable_mark import UnreadableMark


class UnreadableMarkQuery(Query[UnreadableMark]):
    """Reads the marks of commands whose output no reader can read."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, UnreadableMark)

    def of_words(self, leading_terms: Sequence[str]) -> Self:
        return self.matching(Among("words", leading_terms))

    def standing(self) -> Self:
        return self.filter(lifted_at=None)

    def made_after(self, timestamp: Timestamp) -> Self:
        return self.matching(Greater("created_at", timestamp.text))

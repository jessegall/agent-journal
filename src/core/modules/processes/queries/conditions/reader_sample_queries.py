from collections.abc import Mapping
from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class ReaderSampleQueries:
    queries: Mapping[int, Statement]

    def statement(self) -> Statement:
        parts = tuple(Statement(f"SELECT ? AS reader_id, sample.* FROM ({query.sql}) AS sample", [reader_id, *query.parameters])
                      for reader_id, query in self.queries.items())
        return Statement.all_joined(parts, " UNION ALL ")

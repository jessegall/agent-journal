from collections.abc import Sequence
from typing import Self

from core.base.database.database import Database
from engine.model.tables import Tables
from engine.query.query import Query
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.conditions.reader_sample_queries import ReaderSampleQueries
from core.modules.processes.queries.conditions.command_matches import CommandMatches
from core.modules.processes.queries.conditions.kept_output_part import KeptOutputPart


class ProcessPartQuery(Query[ProcessPart]):
    """Reads the parts of processes."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, ProcessPart)

    def process(self, process_id: int) -> Self:
        return self.filter(process_id=process_id).ordered("position")

    def kept_samples(self, patterns: Sequence[str]) -> Self:
        return self.matching(KeptOutputPart(self.database.scope_environment_id)).matching(CommandMatches(patterns)).newest()

    def reader_samples(self, readers: Sequence[Reader], limit: int) -> dict[int, tuple[ProcessPart, ...]]:
        if not readers:
            return {}
        queries = {reader.id: self.kept_samples(tuple(pattern.strip() for pattern in reader.commands.split(","))).select.sliced(limit, 0).statement()
                   for reader in readers}
        samples: dict[int, list[ProcessPart]] = {reader.id: [] for reader in readers}
        for row in self.database.rows(ReaderSampleQueries(queries).statement()):
            samples[row["reader_id"]].append(self.typed(self.table.row_model(row)))
        return {reader_id: tuple(parts) for reader_id, parts in samples.items()}

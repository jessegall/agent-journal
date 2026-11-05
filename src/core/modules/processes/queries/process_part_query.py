from collections.abc import Sequence
from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.queries.conditions.command_matches import CommandMatches
from core.modules.processes.queries.conditions.kept_output_part import KeptOutputPart


class ProcessPartQuery(Query[ProcessPart]):
    """Reads the parts of processes."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, ProcessPart)

    def process(self, process_id: int) -> Self:
        return self.filter(process_id=process_id).ordered("position")

    def kept_samples(self, patterns: Sequence[str]) -> Self:
        return self.matching(KeptOutputPart(self.scope_environment_id)).matching(CommandMatches(patterns)).newest()

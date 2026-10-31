from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.models.output import Output


class OutputQuery(Query[Output]):
    """Reads outputs, with the filters the processes module and its rules use by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Output)

    def kept(self) -> Self:
        return self.filter(state=OutputState.KEPT)

    def unread(self) -> Self:
        return self.kept().matching(IsNull("read_at"))

    def process(self, process_id: int) -> Self:
        return self.filter(process_id=process_id)

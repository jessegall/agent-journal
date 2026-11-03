from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.equal import Equal
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.subquery_match import SubqueryMatch
from core.base.query.query import Query
from core.base.query.select import Select
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.models.process_part import ProcessPart


class ProcessPartQuery(Query[ProcessPart]):
    """Reads the parts of processes."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, ProcessPart)

    def process(self, process_id: int) -> Self:
        return self.filter(process_id=process_id).ordered("position")

    def with_kept_output(self) -> Self:
        outputs = Select("outputs").matching(Equal("state", OutputState.KEPT)).matching(Greater("line_count", 0))
        return self.matching(SubqueryMatch("process_id", outputs.column("process_id")))

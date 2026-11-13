from typing import Self

from engine.database.database import Database
from engine.database.kept_rows import KeptRows
from engine.model.tables import Tables
from engine.query.conditions.greater import Greater
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.equal import Equal
from engine.query.conditions.has_value import HasValue
from engine.query.conditions.among import Among
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.select import Select
from engine.query.query import Query
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.models.output import Output
from core.modules.processes.queries.conditions.part_output import PartOutput
from core.modules.processes.queries.process_query import OPEN

PROCESS_OUTPUTS_REASON = "the output of every process asked about is read"


class OutputQuery(Query[Output]):
    """Reads outputs, with the filters the processes module and its rules use by name."""

    def __init__(self, database: Database, tables: Tables, cached: KeptRows) -> None:
        super().__init__(database, tables, Output)
        self.cached = cached

    def process_outputs(self, process_ids: tuple[int, ...]) -> tuple[Output, ...]:
        return tuple(self.matching(Among("process_id", process_ids)).every_row(PROCESS_OUTPUTS_REASON))

    def running_reader_offsets(self) -> dict[int, int]:
        running = Select("processes").matching(Among("state", OPEN)).column("id")
        outputs = self.matching(SubqueryMatch("process_id", running)).matching(HasValue("reader_id"))
        select = self.scoped(outputs.select.column("process_id, displayed_offset"))
        return {row["process_id"]: row["displayed_offset"] for row in self.database.rows(select.statement())}

    def process_output(self, process_id: int) -> Output | None:
        outputs = self.process(process_id)
        return self.cached.read(outputs, outputs.first, name="processes.process_output")

    def remember(self, output: Output) -> None:
        self.cached.update(self.process(output.process_id), lambda previous: output, name="processes.process_output")

    def remove(self, output: Output) -> None:
        self.cached.update(self.process(output.process_id), lambda previous: None, name="processes.process_output")

    def kept(self) -> Self:
        return self.filter(state=OutputState.KEPT)

    def ended(self) -> Self:
        return self.kept().matching(Greater("ended_at", ""))

    def read_with_lines(self) -> Self:
        return self.ended().matching(HasValue("reader_id")).matching(Greater("line_count", 0))

    def unread(self) -> Self:
        return self.kept().matching(IsNull("read_at"))

    def process(self, process_id: int) -> Self:
        return self.filter(process_id=process_id)

    def running_titles(self, agent_id: int) -> Self:
        running = Select("processes").matching(Equal("session_agent_id", agent_id)).matching(Among("state", OPEN)).column("id")
        return self.matching(SubqueryMatch("process_id", running)).matching(Greater("title", ""))

    def matching_part(self, text: str) -> Self:
        return self.matching(PartOutput(self.database.scope_environment_id, text))

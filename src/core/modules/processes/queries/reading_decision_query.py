from collections.abc import Sequence
from typing import Self

from engine.database.database import Database
from engine.model.tables import Tables
from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.query import Query
from engine.query.select import Select
from engine.time.timestamp import Timestamp
from core.modules.processes.models.enums.reader_state import ReaderState
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.reading_decision_row import ReadingDecisionRow


READERLESS_STATES = (ReaderState.MISSING, ReaderState.POOR)


class ReadingDecisionQuery(Query[ReadingDecisionRow]):
    """Reads the engine's kept decisions about the readers of runs."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, ReadingDecisionRow)

    def process_decisions(self, process_id: int) -> Self:
        return self.filter(process_id=process_id)

    def newest_part_decision(self, process_id: int, part_position: int) -> ReadingDecisionRow | None:
        return self.filter(process_id=process_id, part_position=part_position).descending("decided_at", "id").first()

    def part_end_decision(self, process_id: int, part_position: int) -> ReadingDecisionRow | None:
        return self.filter(process_id=process_id, part_position=part_position, moment=ReadingMoment.END).first()

    def command_key_decisions(self, command_key: str) -> Self:
        return self.filter(command_key=command_key)

    def after(self, timestamp: Timestamp) -> Self:
        return self.matching(Greater("decided_at", timestamp.text))

    def readerless_endings(self) -> Self:
        return self.filter(moment=ReadingMoment.END).matching(Among("state", READERLESS_STATES))

    def excluding_agents(self, agent_ids: Sequence[int]) -> Self:
        runs = Select("processes").matching(Among("session_agent_id", agent_ids, negated=True)).column("id")
        return self.matching(SubqueryMatch("process_id", runs))

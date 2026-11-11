from typing import Self

from engine.database.database import Database
from engine.model.tables import Tables
from engine.query.conditions.greater import Greater
from engine.query.query import Query
from engine.time.timestamp import Timestamp
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.reading_decision_row import ReadingDecisionRow


class ReadingDecisionQuery(Query[ReadingDecisionRow]):
    """Reads the engine's kept decisions about the readers of runs."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, ReadingDecisionRow)

    def for_process(self, process_id: int) -> Self:
        return self.filter(process_id=process_id)

    def newest_for_part(self, process_id: int, part_position: int) -> ReadingDecisionRow | None:
        return self.filter(process_id=process_id, part_position=part_position).descending("decided_at", "id").first()

    def end_for_part(self, process_id: int, part_position: int) -> ReadingDecisionRow | None:
        return self.filter(process_id=process_id, part_position=part_position, moment=ReadingMoment.END).first()

    def for_command_key(self, command_key: str) -> Self:
        return self.filter(command_key=command_key)

    def since(self, timestamp: Timestamp) -> Self:
        return self.matching(Greater("decided_at", timestamp.text))

from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.exists import Exists
from engine.query.conditions.equal import Equal
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.join import Join
from engine.query.select import Select


@dataclass(frozen=True)
class PartOutput:
    """Matches outputs of a command part in an environment."""

    environment_id: int | None
    text: str

    def statement(self) -> Statement:
        parts = Select("process_parts AS part").joined(Join("processes AS process", False, "process.id", "=", "part.process_id")).matching(ColumnCompare("part.process_id", "=", "outputs.process_id"))
        if self.environment_id is not None:
            parts = parts.matching(Equal("process.environment_id", self.environment_id))
        return Exists(parts.matching(Equal("part.text", self.text))).statement()

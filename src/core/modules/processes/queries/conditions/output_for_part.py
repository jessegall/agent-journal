from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class OutputForPart:
    """Matches output whose reader reads a particular command in an environment."""

    environment_id: int
    text: str

    def statement(self) -> Statement:
        return Statement("EXISTS (SELECT 1 FROM process_parts AS part JOIN processes AS process ON process.id = part.process_id"
                         " WHERE part.process_id = outputs.process_id AND process.environment_id = ? AND part.text = ?"
                         " AND (outputs.reader_position = 0 OR outputs.reader_position = part.position))", [self.environment_id, self.text])

from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class PartOutput:
    """Matches outputs of a command part in an environment."""

    environment_id: int | None
    text: str

    def statement(self) -> Statement:
        return Statement("EXISTS (SELECT 1 FROM process_parts AS part JOIN processes AS process ON process.id = part.process_id"
                         " WHERE part.process_id = outputs.process_id AND process.environment_id = COALESCE(?, process.environment_id) AND part.text = ?)", [self.environment_id, self.text])

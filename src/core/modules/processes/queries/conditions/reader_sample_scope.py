from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class ReaderSampleScope:
    """Matches one agent's runs of one exact command in an environment."""

    agent_id: int
    command: str

    def statement(self) -> Statement:
        return Statement("process_id IN (SELECT id FROM processes WHERE session_agent_id = ?)"
                         " AND coalesce(nullif(command, ''), text) = ?",
                         [self.agent_id, self.command])

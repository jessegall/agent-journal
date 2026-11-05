from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class AgentFamily:
    """Matches a main agent and its direct helpers."""

    main_id: int

    def statement(self) -> Statement:
        return Statement("(id = ? OR parent_id = ?)", (self.main_id, self.main_id))

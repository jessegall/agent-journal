from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class MessageTarget:
    agent_id: int

    def statement(self) -> Statement:
        return Statement("(target_agent_id = ? OR (target_agent_id IS NULL AND EXISTS (SELECT 1 FROM agents WHERE id = ? AND role = 'main')))", (self.agent_id, self.agent_id))

from dataclasses import dataclass

from core.base.database.statement import Statement

CHAT_ITEMS = ("(agent_id = ? OR (NOT EXISTS (SELECT 1 FROM agents WHERE id = ? AND role <> 'main')"
             " AND (agent_id IS NULL OR agent_id IN (SELECT id FROM agents WHERE role = 'main'))))")


@dataclass(frozen=True)
class SameChat:
    """Matches the dock items shown in the chat of one agent: a worker's or a subagent's own, and for a main
    agent, or for no agent, the items of the main chat."""

    agent_id: int | None

    def statement(self) -> Statement:
        return Statement(CHAT_ITEMS, [self.agent_id, self.agent_id])

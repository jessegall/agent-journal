from dataclasses import dataclass

from engine.database.statement import Statement
from engine.enums.hook_event_name import HookEventName


@dataclass(frozen=True)
class CurrentSessionRows:
    """Matches rows whose time column is later than the start of an agent's current session: the later of its
    newest session row and its newest session start hook, so a program started again on the same session, as
    after a restart, begins a new one. An agent with neither matches every row."""

    column: str
    session_agent_id: int

    def statement(self) -> Statement:
        return Statement(f"{self.column} > max(coalesce((SELECT started_at FROM agent_sessions WHERE session_agent_id = ? ORDER BY id DESC LIMIT 1), ''),"
                         " coalesce((SELECT max(created_at) FROM hook_calls WHERE session_agent_id = ? AND hook = ?), ''))",
                         [self.session_agent_id, self.session_agent_id, HookEventName.SESSION_START.value])

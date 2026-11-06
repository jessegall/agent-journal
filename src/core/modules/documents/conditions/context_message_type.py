from dataclasses import dataclass

from core.base.database.statement import Statement
from core.base.query.condition import Condition


@dataclass(frozen=True)
class ContextMessageType:
    """Includes conversation messages and user-owned journal references without treating them as person speech."""

    users: Condition

    def statement(self) -> Statement:
        users = self.users.statement()
        return Statement(f"(type IN ('user', 'comment', 'agent') OR (type = 'journal' AND creator_id IN ({users.sql})))", users.parameters)

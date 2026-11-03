from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class NonHelperRows:
    """Matches the rows no worker or subagent made."""

    def statement(self) -> Statement:
        return Statement("creator_id NOT IN (SELECT id FROM agents WHERE role <> 'main')")

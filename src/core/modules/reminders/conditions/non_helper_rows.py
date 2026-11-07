from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class NonHelperRows:
    """Matches rows created by a main agent or a person."""

    def statement(self) -> Statement:
        return Statement("creator_id NOT IN (SELECT id FROM agents WHERE role <> 'main')")

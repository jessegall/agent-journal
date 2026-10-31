from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class NoOpenDependency:
    """Matches the rows whose task waits on no task that is still open."""

    column: str

    def statement(self) -> Statement:
        return Statement(f"{self.column} NOT IN (SELECT task_id FROM open_dependencies)", [])

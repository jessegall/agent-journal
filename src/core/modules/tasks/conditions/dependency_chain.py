from dataclasses import dataclass

from core.base.database.statement import Statement

CHAIN = ("id IN (WITH RECURSIVE chain(id) AS (SELECT dependency_id FROM task_dependencies WHERE task_id = ?"
         " UNION SELECT task_dependencies.dependency_id FROM task_dependencies JOIN chain ON task_dependencies.task_id = chain.id)"
         " SELECT id FROM chain)")


@dataclass(frozen=True)
class DependencyChain:
    """Matches every task a task depends on, directly or through others, in one recursive query."""

    task_id: int

    def statement(self) -> Statement:
        return Statement(CHAIN, (self.task_id,))

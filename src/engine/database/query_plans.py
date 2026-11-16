from typing import ClassVar

from engine.database.database import Database
from engine.database.statement import Statement


class QueryPlans:
    """The query plan of each SQL text, kept for the whole process: the tables and indexes of a checkout come
    from its code, so one SQL text plans alike in every database of the same code, and the plans are dropped
    whenever a sync can change the schema."""

    plans: ClassVar[dict[str, tuple[str, ...]]] = {}

    @classmethod
    def plan(cls, database: Database, statement: Statement) -> tuple[str, ...]:
        if statement.sql not in cls.plans:
            cls.plans[statement.sql] = database.query_plan(statement)
        return cls.plans[statement.sql]

    @classmethod
    def forget(cls) -> None:
        cls.plans.clear()

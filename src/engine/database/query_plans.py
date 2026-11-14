from typing import ClassVar

from engine.database.database import Database
from engine.database.statement import Statement

SCHEMA_TEXT = "SELECT group_concat(sql, ';') FROM (SELECT sql FROM sqlite_master WHERE sql IS NOT NULL ORDER BY name)"


class QueryPlans:
    """The query plan of each SQL text, kept for the whole process by the schema it was planned on: the same
    query shape is planned once however many stories or requests read it, and a database with another schema
    (other tables or indexes) is planned again."""

    plans: ClassVar[dict[tuple[str, str], tuple[str, ...]]] = {}

    @classmethod
    def plan(cls, database: Database, schema: str, statement: Statement) -> tuple[str, ...]:
        key = (schema, statement.sql)
        if key not in cls.plans:
            cls.plans[key] = database.query_plan(statement)
        return cls.plans[key]

    @staticmethod
    def schema(database: Database) -> str:
        return database.schema_text(SCHEMA_TEXT)

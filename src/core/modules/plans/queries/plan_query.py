from typing import Self

from engine.database.database import Database
from engine.model.tables import Tables
from engine.query.conditions.is_null import IsNull
from engine.query.query import Query
from core.modules.plans.models.plan import Plan


class PlanQuery(Query[Plan]):
    """Reads plans, with the filters the plans module uses by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Plan)

    def unclosed(self) -> Self:
        return self.matching(IsNull("closed_at"))

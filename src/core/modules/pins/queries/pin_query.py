from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from engine.query.conditions.is_null import IsNull
from engine.query.query import Query
from core.modules.pins.models.pin import Pin


class PinQuery(Query[Pin]):
    """Reads pins, with the open ones of an environment."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Pin)

    def open_pins(self) -> Self:
        return self.matching(IsNull("closed_at"))

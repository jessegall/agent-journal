from typing import TypeVar

from core.base.database.database import Database
from core.base.model.model import Model
from core.base.model.tables import Tables
from core.base.model.view_model import ViewModel
from core.base.query.query import Query

M = TypeVar("M", bound=Model | ViewModel)


class Queries:
    """Gives the base query of any model or view, for code that needs no named filters of its own."""

    def __init__(self, database: Database, tables: Tables) -> None:
        self.database, self.tables = database, tables

    def query(self, model: type[M]) -> Query[M]:
        return Query(self.database, self.tables, model)

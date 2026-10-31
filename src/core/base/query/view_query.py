from dataclasses import fields
from typing import Generic, TypeVar, get_type_hints

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.missing_rows import MissingRows
from core.base.model.table import loaded, plain_type
from core.base.model.view_model import ViewModel

V = TypeVar("V", bound=ViewModel)


class ViewQuery(Generic[V]):
    """Reads one row of a database view by its key."""

    def __init__(self, database: Database, view_model: type[V]) -> None:
        self.database, self.view_model = database, view_model
        self.types = {name: plain_type(hint) for name, hint in get_type_hints(view_model).items() if name in {field.name for field in fields(view_model)}}

    def find(self, key: int) -> V:
        rows = self.database.rows(Statement(f"SELECT * FROM {self.view_model.view} WHERE {self.view_model.key} = ?", (key,)))
        if not rows:
            raise MissingRows(self.view_model.cli_noun, (key,))
        return self.view_model(**{name: loaded(kind, rows[0][name]) for name, kind in self.types.items()})

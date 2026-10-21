from journal.db.connection import Connection
from journal.db.query import Query
from journal.models.all_models import AllModels
from journal.models.support.ref import Ref


class Rows:
    """Any row read by its reference alone, as tasks:12, for what knows a row only by where it points; a reference to a table no model has names no row."""

    def __init__(self, connection: Connection) -> None:
        self.connection = connection
        self.tables = {model.table(): Query.build(model) for model in AllModels.MODELS}

    def is_row(self, ref: Ref) -> bool:
        return bool(self._rows(ref))

    def row_state(self, ref: Ref) -> str:
        rows = self._rows(ref)
        return rows[0]["state"] if rows else ""

    def _rows(self, ref: Ref) -> list:
        query = self.tables.get(ref.type)
        return [] if query is None else self.connection.all(*query.filter(id=ref.id).select())

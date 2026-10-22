from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.all_models import AllModels
from journal.repositories.table_rows import TableRows


class SharedTables:
    """The plain repository of every shared model's table, by table name, which changes pulled from the team server are written through."""

    def __init__(self, connection: Connection, bus: Bus) -> None:
        self.tables = {model.table(): TableRows(connection, bus, model) for model in AllModels.MODELS if model.shared}

    def has(self, table: str) -> bool:
        return table in self.tables

    def rows(self, table: str) -> TableRows:
        return self.tables[table]

    def names(self) -> list[str]:
        return list(self.tables)

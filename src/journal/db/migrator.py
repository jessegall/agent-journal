from journal.db.connection import Connection
from journal.db.migration import Migration
from journal.db.schema import Schema


class Migrator:
    def __init__(self, connection: Connection, schema: Schema) -> None: ...

    def pending(self) -> list[Migration]: ...

    def run(self) -> list[Migration]: ...

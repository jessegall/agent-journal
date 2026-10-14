from journal.db.connection import Connection
from journal.db.schema import Schema


class Migration:
    number: int

    def up(self, connection: Connection) -> None: ...


class Migrator:
    def __init__(self, connection: Connection, schema: Schema) -> None: ...

    def pending(self) -> list[Migration]: ...

    def run(self) -> list[Migration]: ...

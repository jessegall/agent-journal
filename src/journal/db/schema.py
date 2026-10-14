from journal.db.connection import Connection


class Schema:
    """Creates the tables and records which migrations ran."""

    def __init__(self, connection: Connection) -> None: ...

    def create(self) -> None: ...

    def version(self) -> int: ...

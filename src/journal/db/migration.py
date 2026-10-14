from journal.db.connection import Connection


class Migration:
    number: int

    def up(self, connection: Connection) -> None: ...

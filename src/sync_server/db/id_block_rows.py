from sync_server.db.store import Store


class IdBlockRows:
    """The SQL of the number blocks handed out and the numbers a shared journal already used."""

    def __init__(self, store: Store) -> None:
        self.store = store

    def last_number(self, table: str) -> int:
        return self.store.one("SELECT COALESCE(MAX(last_number), 0) AS last FROM id_blocks WHERE row_table = ?", (table,))["last"]

    def floor_number(self, table: str) -> int:
        return self.store.one("SELECT COALESCE(MAX(highest), 0) AS highest FROM id_floors WHERE row_table = ?", (table,))["highest"]

    def insert(self, device_id: int, table: str, first: int, last: int) -> None:
        self.store.execute("INSERT INTO id_blocks (device_id, row_table, first_number, last_number) VALUES (?, ?, ?, ?)", (device_id, table, first, last))

    def raise_floor(self, table: str, highest: int) -> None:
        self.store.execute("INSERT INTO id_floors (row_table, highest) VALUES (?, ?) ON CONFLICT (row_table) DO UPDATE SET highest = MAX(highest, excluded.highest)", (table, highest))

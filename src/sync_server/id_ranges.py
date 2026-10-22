from sync_server.db.id_block_rows import IdBlockRows
from sync_server.db.store import Store


class IdRanges:
    """The blocks of row numbers handed to each device per table, each above every number handed out before and above the highest a journal already had when it became shared, so no two machines ever give one number."""

    def __init__(self, store: Store, rows: IdBlockRows) -> None:
        self.store, self.rows = store, rows

    def block(self, device_id: int, table: str, size: int) -> tuple[int, int]:
        with self.store.transaction():
            first = max(self.rows.last_number(table), self.rows.floor_number(table)) + 1
            self.rows.insert(device_id, table, first, first + size - 1)
            return first, first + size - 1

    def raise_floor(self, table: str, highest: int) -> None:
        self.rows.raise_floor(table, highest)

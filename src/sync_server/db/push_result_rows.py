from sqlite3 import Row

from sync_server.db.store import Store


class PushResultRows:
    """The SQL of the push results table: what the server answered for each change a device pushed, by the device's own number for it."""

    def __init__(self, store: Store) -> None:
        self.store = store

    def stored(self, device_id: int, local_number: int) -> Row | None:
        return self.store.one("SELECT sequence, rejected FROM push_results WHERE device_id = ? AND local_number = ?", (device_id, local_number))

    def write(self, device_id: int, local_number: int, sequence: int, rejected: str) -> None:
        self.store.execute("INSERT INTO push_results (device_id, local_number, sequence, rejected) VALUES (?, ?, ?, ?)", (device_id, local_number, sequence, rejected))

from sqlite3 import Row

from sync_server.db.store import Store


class LeaseRows:
    """The SQL of the leases table: one row per name, the device and account holding it and when it was last renewed."""

    def __init__(self, store: Store) -> None:
        self.store = store

    def current(self, name: str) -> Row | None:
        return self.store.one("SELECT name, device_id, account_id, renewed_at FROM leases WHERE name = ?", (name,))

    def write(self, name: str, device_id: int, account_id: int, renewed_at: float) -> None:
        self.store.execute("INSERT INTO leases (name, device_id, account_id, renewed_at) VALUES (?, ?, ?, ?) ON CONFLICT (name) DO UPDATE SET device_id = excluded.device_id, account_id = excluded.account_id, renewed_at = excluded.renewed_at", (name, device_id, account_id, renewed_at))

    def remove(self, name: str) -> None:
        self.store.execute("DELETE FROM leases WHERE name = ?", (name,))

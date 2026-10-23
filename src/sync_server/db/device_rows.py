from sqlite3 import Row

from sync_server.db.store import Store


class DeviceRows:
    """The SQL of the devices table."""

    def __init__(self, store: Store) -> None:
        self.store = store

    def insert(self, account_id: int, name: str, token_hash: str, created_at: float) -> int:
        return self.store.execute("INSERT INTO devices (account_id, name, token_hash, created_at) VALUES (?, ?, ?, ?)", (account_id, name, token_hash, created_at)).lastrowid

    def numbered(self, id: int) -> Row | None:
        return self.store.one("SELECT id, account_id, name, revoked_at FROM devices WHERE id = ?", (id,))

    def with_token_hash(self, token_hash: str) -> Row | None:
        return self.store.one("SELECT id FROM devices WHERE token_hash = ?", (token_hash,))

    def ids(self) -> list[int]:
        return [row["id"] for row in self.store.all("SELECT id FROM devices ORDER BY id")]

    def revoke(self, id: int, revoked_at: float) -> None:
        self.store.execute("UPDATE devices SET revoked_at = ? WHERE id = ?", (revoked_at, id))

    def record_pull(self, id: int, sequence: int) -> None:
        self.store.execute("UPDATE devices SET pulled_sequence = MAX(pulled_sequence, ?) WHERE id = ?", (sequence, id))

    def lowest_pull(self) -> int:
        return self.store.one("SELECT COALESCE(MIN(pulled_sequence), 0) AS lowest FROM devices WHERE revoked_at = 0 AND pulled_sequence > 0")["lowest"]

    def pulled_sequence(self, id: int) -> int:
        return self.store.one("SELECT pulled_sequence FROM devices WHERE id = ?", (id,))["pulled_sequence"]

    def revoke_account(self, account_id: int, revoked_at: float) -> None:
        self.store.execute("UPDATE devices SET revoked_at = ? WHERE account_id = ? AND revoked_at = 0", (revoked_at, account_id))

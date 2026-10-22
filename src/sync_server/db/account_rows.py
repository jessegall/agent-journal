from sqlite3 import Row

from sync_server.db.store import Store


class AccountRows:
    """The SQL of the accounts table."""

    def __init__(self, store: Store) -> None:
        self.store = store

    def insert(self, email: str, name: str, role: str, password_hash: str, created_at: float) -> int:
        return self.store.execute("INSERT INTO accounts (email, name, role, password_hash, created_at) VALUES (?, ?, ?, ?, ?)", (email, name, role, password_hash, created_at)).lastrowid

    def numbered(self, id: int) -> Row | None:
        return self.store.one("SELECT id, email, name, role, removed_at FROM accounts WHERE id = ?", (id,))

    def with_email(self, email: str) -> Row | None:
        return self.store.one("SELECT id, password_hash, removed_at FROM accounts WHERE email = ?", (email,))

    def count(self) -> int:
        return self.store.one("SELECT COUNT(*) AS count FROM accounts")["count"]

    def remove(self, id: int, removed_at: float) -> None:
        self.store.execute("UPDATE accounts SET removed_at = ? WHERE id = ?", (removed_at, id))

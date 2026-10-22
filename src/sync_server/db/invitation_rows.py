from sqlite3 import Row

from sync_server.db.store import Store


class InvitationRows:
    """The SQL of the invitations table: each code kept only as a hash, with the email it is for, when it expires and when it was used."""

    def __init__(self, store: Store) -> None:
        self.store = store

    def insert(self, code_hash: str, email: str, created_at: float, expires_at: float) -> None:
        self.store.execute("INSERT INTO invitations (code_hash, email, created_at, expires_at) VALUES (?, ?, ?, ?)", (code_hash, email, created_at, expires_at))

    def with_code_hash(self, code_hash: str) -> Row | None:
        return self.store.one("SELECT id, email, expires_at, used_at FROM invitations WHERE code_hash = ?", (code_hash,))

    def use(self, id: int, used_at: float) -> None:
        self.store.execute("UPDATE invitations SET used_at = ? WHERE id = ?", (used_at, id))

from sync_server.db.store import Store


class FailedLoginRows:
    """The SQL of the failed logins table."""

    def __init__(self, store: Store) -> None:
        self.store = store

    def insert(self, address: str, failed_at: float) -> None:
        self.store.execute("INSERT INTO failed_logins (address, failed_at) VALUES (?, ?)", (address, failed_at))

    def count(self, address: str, earliest_at: float) -> int:
        return self.store.one("SELECT COUNT(*) AS count FROM failed_logins WHERE address = ? AND failed_at > ?", (address, earliest_at))["count"]

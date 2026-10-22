from sync_server.db.store import Store


class TeamDetailRows:
    """The SQL of the team details table: one value per name."""

    def __init__(self, store: Store) -> None:
        self.store = store

    def value(self, name: str) -> str:
        row = self.store.one("SELECT value FROM team_details WHERE name = ?", (name,))
        return row["value"] if row else ""

    def write(self, name: str, value: str) -> None:
        self.store.execute("INSERT INTO team_details (name, value) VALUES (?, ?) ON CONFLICT (name) DO UPDATE SET value = excluded.value", (name, value))

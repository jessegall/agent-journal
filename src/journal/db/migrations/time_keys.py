import json
from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration

ENTRY_KEY = "UPDATE entries SET data = json_set(json_remove(data, '$.at'), '$.time', json_extract(data, '$.at')) WHERE json_extract(data, '$.at') IS NOT NULL"


class TimeKeys(Migration):
    """The name at is time everywhere: the edits table's column, carried over into the time column the schema already added when both are there, the time key in an entry's data, a check's running progress, and a dump's question, answers and choices."""

    number: ClassVar[int] = 20

    def apply(self, connection: Connection) -> None:
        columns = {row["name"] for row in connection.all("PRAGMA table_info(edits)")}
        if "at" in columns and "time" in columns:
            connection.execute("UPDATE edits SET time = at")
            connection.execute("DROP INDEX IF EXISTS edits_by_session")
            connection.execute("ALTER TABLE edits DROP COLUMN at")
            connection.execute("CREATE INDEX IF NOT EXISTS edits_by_session ON edits (environment_id, session, time)")
        elif "at" in columns:
            connection.execute("ALTER TABLE edits RENAME COLUMN at TO time")
        connection.execute(ENTRY_KEY)
        for row in connection.all("SELECT id, running FROM checks WHERE running IS NOT NULL AND running != ''"):
            connection.execute("UPDATE checks SET running = ? WHERE id = ?", (json.dumps(self.renamed(json.loads(row["running"]))), row["id"]))
        for row in connection.all("SELECT id, question, answers, chosen, taken FROM dumps"):
            values = tuple(json.dumps(self.renamed(json.loads(row[name]))) if row[name] else row[name] for name in ("question", "answers", "chosen", "taken"))
            connection.execute("UPDATE dumps SET question = ?, answers = ?, chosen = ?, taken = ? WHERE id = ?", (*values, row["id"]))

    def renamed(self, value):
        if isinstance(value, dict):
            return {("time" if key == "at" else key): self.renamed(inner) for key, inner in value.items()}
        if isinstance(value, list):
            return [self.renamed(inner) for inner in value]
        return value

import json
from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration

TABLES = {"todo": "tasks", "doc": "docs", "plan": "plans", "report": "reports", "message": "messages", "question": "questions", "fact": "facts", "rule": "rules",
          "reminder": "reminders", "check": "checks", "trigger": "triggers", "sequence": "sequences", "secret": "secrets", "helper": "workers", "template": "templates"}


class NameCardRowsByTable(Migration):
    """Every card in the chat names the row it opens as the journal does, by its table, docs:12, where it was written as the old viewer named it, doc:12."""

    number: ClassVar[int] = 14

    def up(self, connection: Connection) -> None:
        for row in connection.all("SELECT id, data FROM messages WHERE json_extract(data, '$.row') LIKE '%:%' OR json_extract(data, '$.made_type') IS NOT NULL"):
            data = json.loads(row["data"])
            kind, _, id = str(data.get("row", "")).partition(":")
            if kind in TABLES:
                data["row"] = f"{TABLES[kind]}:{id}"
            if data.get("made_type") in TABLES:
                data["made_type"] = TABLES[data["made_type"]]
            connection.execute("UPDATE messages SET data = ? WHERE id = ?", (json.dumps(data), row["id"]))

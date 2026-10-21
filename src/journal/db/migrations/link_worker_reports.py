from datetime import datetime, timezone
from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class LinkWorkerReports(Migration):
    """Each worker is linked to the message holding the last report it filed, so its report no longer has to be found among the recent messages."""

    number: ClassVar[int] = 5

    def apply(self, connection: Connection) -> None:
        time = datetime.now(timezone.utc).isoformat()
        for worker in connection.all("SELECT id, name, environment_id FROM workers"):
            message = connection.one("SELECT id FROM messages WHERE environment_id = ? AND text LIKE ? ORDER BY id DESC LIMIT 1", (worker["environment_id"], f"{worker['name']} reports: %"))
            if message:
                connection.execute("INSERT INTO links (created_at, creator, updated_at, updater, source, target, kind) VALUES (?, ?, ?, ?, ?, ?, ?)", (time, "system", time, "system", f"workers:{worker['id']}", f"messages:{message['id']}", "reported"))

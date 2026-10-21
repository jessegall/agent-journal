from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class WorkerReuseCounts(Migration):
    """Each worker's reuse count is read from its earlier sends: every report it filed but the last was followed by a send, and so was the last when it is out again."""

    number: ClassVar[int] = 30

    def apply(self, connection: Connection) -> None:
        for worker in connection.all("SELECT id, state FROM workers WHERE reuse_count IS NULL OR reuse_count = 0"):
            reports = connection.result("SELECT COUNT(*) AS n FROM links WHERE source = ? AND kind = 'reported'", (f"workers:{worker['id']}",))["n"]
            sends = reports if worker["state"] == "dispatched" else reports - 1
            connection.execute("UPDATE workers SET reuse_count = ? WHERE id = ?", (max(sends, 0), worker["id"]))

from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class WorkerSilenceFold(Migration):
    """A worker's quiet span and whether it was told are one value in its silence column, and the column that kept the told flag apart goes."""

    number: ClassVar[int] = 32

    def apply(self, connection: Connection) -> None:
        present = {row["name"] for row in connection.all("PRAGMA table_info(workers)")}
        if "silence_reported" not in present:
            return
        connection.execute("UPDATE workers SET silence = json_object('timeout', json(silence), 'is_reported', json(CASE WHEN silence_reported THEN 'true' ELSE 'false' END)) WHERE silence IS NOT NULL AND json_extract(silence, '$.timeout') IS NULL")
        connection.execute("ALTER TABLE workers DROP COLUMN silence_reported")

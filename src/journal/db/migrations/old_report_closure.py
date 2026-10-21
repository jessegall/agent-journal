from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class OldReportClosure(Migration):
    """Every report filed before the journal named the ones not acted on counts as acted on, so only new reports are named."""

    number: ClassVar[int] = 12

    def up(self, connection: Connection) -> None:
        connection.execute("UPDATE workers SET taken_up = 1 WHERE state != 'dispatched'")

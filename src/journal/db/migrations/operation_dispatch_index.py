from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration
from journal.repositories.entries import DISPATCHES


class OperationDispatchIndex(Migration):
    """The index of a subagent's dispatch entries made anew on the operation each tool call records, in place of the tool's name."""

    number: ClassVar[int] = 27

    def apply(self, connection: Connection) -> None:
        connection.execute("DROP INDEX IF EXISTS entries_dispatches")
        connection.execute(f"CREATE INDEX entries_dispatches ON entries (environment_id, id) WHERE {DISPATCHES}")

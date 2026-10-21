from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration
from journal.repositories.entries import DISPATCHES


class DispatchIndex(Migration):
    """An index of the few entries that start, answer or close a subagent's dispatch, so a session's subagents are read without walking every entry."""

    number: ClassVar[int] = 11

    def apply(self, connection: Connection) -> None:
        connection.execute(f"CREATE INDEX IF NOT EXISTS entries_dispatches ON entries (environment_id, id) WHERE {DISPATCHES.clause()}")

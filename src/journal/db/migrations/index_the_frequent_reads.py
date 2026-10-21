from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration

INDEXES = (
    ("entries_by_kind_id", "entries (environment_id, kind, id)"),
    ("entries_by_actor", "entries (actor, id)"),
    ("messages_by_reply", "messages (reply_to)"),
    ("messages_unread", "messages (environment_id, author, read_at)"),
    ("messages_by_key", "messages (environment_id, idempotency)"),
    ("messages_by_update", "messages (environment_id, updated_at)"),
    ("tasks_by_state", "tasks (environment_id, state, id)"),
    ("outputs_by_chain", "command_outputs (chain, id)"),
    ("edits_by_session", "edits (environment_id, session, time)"),
    ("agents_by_session", "agents (session)"),
    ("statistics_by_key", "statistics (key)"),
)


class IndexTheFrequentReads(Migration):
    """Indexes for the reads made on every hook or poll: entries of a kind newest first, a message's replies and the unread ones, an environment's counts, tasks by state and the rest; the kind index alone gives way to the one that also orders."""

    number: ClassVar[int] = 13

    def up(self, connection: Connection) -> None:
        for name, on in INDEXES:
            connection.execute(f"CREATE INDEX IF NOT EXISTS {name} ON {on}")
        connection.execute("DROP INDEX IF EXISTS entries_by_kind")

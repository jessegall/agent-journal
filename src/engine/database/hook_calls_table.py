from engine.database.database import Database
from engine.database.statement import Statement

BATCH = "SELECT id FROM hook_calls WHERE id > ? AND created_at < ? ORDER BY id LIMIT ?"
DELETABLE_LINE_STATES = "('delivered', 'entered', 'hidden')"


class HookCallsTable:
    """Deletes old hook calls and their delivered lines with plain statements, without an event per row, so a
    prune of many thousand rows never fills the event log or holds the write lock for long."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def delete_batch(self, after_id: int, cutoff: str, rows: int) -> tuple[int, int]:
        ids = [int(row["id"]) for row in self.database.rows(Statement(BATCH, [after_id, cutoff, rows], named_limit_rows=rows))]
        if not ids:
            return 0, after_id
        marks = ", ".join("?" for _ in ids)
        self.database.update(Statement(f"DELETE FROM agent_lines WHERE hook_call_id IN ({marks}) AND state IN {DELETABLE_LINE_STATES}", ids))
        deleted = self.database.update(Statement(f"DELETE FROM hook_calls WHERE id IN ({marks})"
                                                 " AND NOT EXISTS (SELECT 1 FROM agent_lines WHERE agent_lines.hook_call_id = hook_calls.id)", ids))
        return deleted, ids[-1]

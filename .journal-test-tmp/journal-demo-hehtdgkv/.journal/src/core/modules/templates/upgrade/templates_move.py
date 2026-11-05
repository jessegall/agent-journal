import json
import sqlite3

from core.base.database.row_insert import RowInsert
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.table_copy_move import TableCopyMove

TABLE = "templates"
LIST_FIELDS = ("targets", "parts", "commands")


class TemplatesMove(TableCopyMove):
    """Carries version 4's templates with their numbers, briefs, the rows they apply to, purposes, parts and
    phase-end commands."""

    name = "templates"
    table = TABLE
    reads = [TABLE]
    id_modules = ["journal.core.actors"]

    def insert(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        lists = {field: json.dumps(json.loads(row[field] or "[]")) for field in LIST_FIELDS}
        return rows.insert(TABLE, {"id": row["id"], "creator_id": creator_id, "title": row["title"], "brief": row["brief"] or "", "purpose": row["purpose"] or "",
                                   **lists, "created_at": created, "updated_at": row["updated_at"] or created})

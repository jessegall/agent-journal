import json

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.database.moved_row import MovedRow

MAP = "version_four_map"
MOVES = "version_four_moves"


class UpgradeMapTable:
    """The core's two tables of an upgrade from version 4: the rows moved, version 4 table and id against version 5
    table and id, and the moves finished with their counts."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def new_id(self, old_table: str, old_id: int) -> int | None:
        rows = self.database.rows(Statement(f"SELECT new_id FROM {MAP} WHERE old_table = ? AND old_id = ?", (old_table, old_id)))
        return int(rows[0]["new_id"]) if rows else None

    def record(self, moved: MovedRow) -> None:
        self.database.update(Statement(f"INSERT OR IGNORE INTO {MAP} (old_table, old_id, new_table, new_id) VALUES (?, ?, ?, ?)",
                                       (moved.old_table, moved.old_id, moved.new_table, moved.new_id)))

    def count(self) -> int:
        return int(self.database.rows(Statement(f"SELECT count(*) AS total FROM {MAP}"))[0]["total"])

    def finish(self, module: str, move: str, counts: dict[str, dict[str, int]]) -> None:
        self.database.update(Statement(f"INSERT OR REPLACE INTO {MOVES} (module, move, finished_at, counts) VALUES (?, ?, strftime('%Y-%m-%dT%H:%M:%f+00:00', 'now'), ?)",
                                       (module, move, json.dumps(counts, sort_keys=True))))

    def finished(self, module: str, move: str) -> dict[str, dict[str, int]] | None:
        rows = self.database.rows(Statement(f"SELECT counts FROM {MOVES} WHERE module = ? AND move = ?", (module, move)))
        return json.loads(rows[0]["counts"]) if rows else None

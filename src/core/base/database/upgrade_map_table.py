from core.base.database.database import Database
from core.base.database.statement import Statement

TABLE = "upgrade_map"


class UpgradeMapTable:
    """The table of rows moved from version 4, made when first used: version 4 table and id, version 5 table and
    id, one row for each version 4 row."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def ensure(self) -> None:
        self.database.update(Statement(f"CREATE TABLE IF NOT EXISTS {TABLE} (old_table TEXT NOT NULL, old_id INTEGER NOT NULL, new_table TEXT NOT NULL,"
                                       " new_id INTEGER NOT NULL, PRIMARY KEY (old_table, old_id))"))

    def new_id(self, old_table: str, old_id: int) -> int | None:
        self.ensure()
        rows = self.database.rows(Statement(f"SELECT new_id FROM {TABLE} WHERE old_table = ? AND old_id = ?", (old_table, old_id)))
        return int(rows[0]["new_id"]) if rows else None

    def record(self, old_table: str, old_id: int, new_table: str, new_id: int) -> None:
        self.ensure()
        self.database.update(Statement(f"INSERT OR IGNORE INTO {TABLE} (old_table, old_id, new_table, new_id) VALUES (?, ?, ?, ?)", (old_table, old_id, new_table, new_id)))

    def count(self) -> int:
        self.ensure()
        return int(self.database.rows(Statement(f"SELECT count(*) AS total FROM {TABLE}"))[0]["total"])

import json
from collections.abc import Iterator
from contextlib import contextmanager

from engine.database.database import Database
from engine.database.statement import Statement
from engine.database.unique_key import UniqueKey

SCHEMA_REASON = "The fold of main agents walks the rows that hold a folded agent, once, in one transaction."
STATE_REMOVAL_RULE_SUFFIX = "_rule_state_delete"
UNIQUE_INDEXES = Statement("SELECT tables.name AS table_name, indexes.name AS index_name, indexes.partial AS partial,"
                           " (SELECT sql FROM sqlite_master WHERE type = 'index' AND name = indexes.name) AS index_sql"
                           " FROM sqlite_master AS tables, pragma_index_list(tables.name) AS indexes"
                           " WHERE tables.type = 'table' AND indexes.\"unique\" = 1 AND indexes.origin != 'pk'", scan_reason=SCHEMA_REASON)
WHERE_WORD = " WHERE "


class ReferenceRewrite:
    """Reads, rewrites and removes the rows that hold an agent id in named columns, for the fold of main agents;
    the table and column names come from the live schema, never from a user."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def rows_where(self, table: str, column: str, value: object) -> list[dict[str, object]]:
        matched = self.database.rows(Statement(f'SELECT * FROM "{table}" WHERE "{column}" = ?', [value], scan_reason=SCHEMA_REASON))
        return [dict(row) for row in matched]

    # Turns the foreign key checks off while a fold moves rows between ids, and on again after.
    @contextmanager
    def without_foreign_keys(self) -> Iterator[None]:
        self.database.update(Statement("PRAGMA foreign_keys = OFF"))
        try:
            yield
        finally:
            self.database.update(Statement("PRAGMA foreign_keys = ON"))

    @staticmethod
    def marks(ids: list[int]) -> str:
        return ", ".join("?" for _ in ids)

    def count(self, table: str, column: str, ids: list[int]) -> int:
        return int(self.database.rows(Statement(f'SELECT count(*) AS n FROM "{table}" WHERE "{column}" IN ({self.marks(ids)})', list(ids), scan_reason=SCHEMA_REASON))[0]["n"])

    def pair_count(self, table: str, model_column: str, id_column: str, models: tuple[str, ...], ids: list[int]) -> int:
        statement = Statement(f'SELECT count(*) AS n FROM "{table}" WHERE "{model_column}" IN ({self.marks(list(models))}) AND "{id_column}" IN ({self.marks(ids)})',
                              [*models, *ids], scan_reason=SCHEMA_REASON)
        return int(self.database.rows(statement)[0]["n"])

    def rows(self, table: str, column: str, ids: list[int]) -> list[dict[str, object]]:
        matched = self.database.rows(Statement(f'SELECT * FROM "{table}" WHERE "{column}" IN ({self.marks(ids)})', list(ids), scan_reason=SCHEMA_REASON))
        return [dict(row) for row in matched]

    def rewrite(self, table: str, column: str, ids: list[int], target_id: int) -> int:
        return self.database.update(Statement(f'UPDATE "{table}" SET "{column}" = ? WHERE "{column}" IN ({self.marks(ids)})', [target_id, *ids]))

    def pair_rewrite(self, table: str, model_column: str, id_column: str, models: tuple[str, ...], ids: list[int], target_id: int) -> int:
        return self.database.update(Statement(f'UPDATE "{table}" SET "{id_column}" = ? WHERE "{model_column}" IN ({self.marks(list(models))}) AND "{id_column}" IN ({self.marks(ids)})',
                                              [target_id, *models, *ids]))

    def delete(self, table: str, ids: list[int]) -> int:
        return self.database.update(Statement(f'DELETE FROM "{table}" WHERE id IN ({self.marks(ids)})', list(ids))) if ids else 0

    def delete_past_state_rule(self, table: str, ids: list[int]) -> int:
        rule = f"{table}{STATE_REMOVAL_RULE_SUFFIX}"
        saved = self.database.rows(Statement("SELECT sql FROM sqlite_master WHERE type = 'trigger' AND name = ?", [rule], scan_reason=SCHEMA_REASON))
        if saved:
            self.database.update(Statement(f'DROP TRIGGER "{rule}"'))
        removed = self.delete(table, ids)
        if saved:
            self.database.update(Statement(saved[0]["sql"]))
        return removed

    def unique_keys(self) -> list[UniqueKey]:
        found = []
        for index in self.database.rows(UNIQUE_INDEXES):
            columns = self.database.rows(Statement(f'SELECT name FROM pragma_index_info("{index["index_name"]}")', scan_reason=SCHEMA_REASON))
            guarded = str(index["index_sql"]).split(WHERE_WORD, 1)[1] if index["partial"] else "1 = 1"
            found.append(UniqueKey(str(index["table_name"]), tuple(str(column["name"]) for column in columns if column["name"] is not None), guarded))
        return found

    def guarded_rows(self, unique: UniqueKey, column: str, ids: list[int]) -> list[dict[str, object]]:
        found = self.database.rows(Statement(f'SELECT * FROM "{unique.table}" WHERE "{column}" IN ({self.marks(ids)}) AND ({unique.guarded})', list(ids), scan_reason=SCHEMA_REASON))
        return [dict(row) for row in found]

    def table_counts(self, tables: list[str]) -> dict[str, int]:
        return {table: int(self.database.rows(Statement(f'SELECT count(*) AS n FROM "{table}"', scan_reason=SCHEMA_REASON))[0]["n"]) for table in tables}

    def broken_keys(self) -> list[str]:
        return [json.dumps(dict(row)) for row in self.database.rows(Statement("PRAGMA foreign_key_check", scan_reason=SCHEMA_REASON))]

    def is_intact(self) -> bool:
        return self.database.rows(Statement("PRAGMA integrity_check", scan_reason=SCHEMA_REASON))[0][0] == "ok"

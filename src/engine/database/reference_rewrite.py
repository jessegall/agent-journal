import json

from engine.database.database import Database
from engine.database.statement import Statement

SCHEMA_REASON = "The fold of main agents walks the rows that hold a folded agent, once, in one transaction."
UNIQUE_INDEXES = Statement("SELECT tables.name AS table_name, indexes.name AS index_name FROM sqlite_master AS tables, pragma_index_list(tables.name) AS indexes"
                           " WHERE tables.type = 'table' AND indexes.\"unique\" = 1 AND indexes.origin != 'pk'", scan_reason=SCHEMA_REASON)


class ReferenceRewrite:
    """Reads, rewrites and removes the rows that hold an agent id in named columns, for the fold of main agents;
    the table and column names come from the live schema, never from a person."""

    def __init__(self, database: Database) -> None:
        self.database = database

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
        found = self.database.rows(Statement(f'SELECT * FROM "{table}" WHERE "{column}" IN ({self.marks(ids)})', list(ids), scan_reason=SCHEMA_REASON))
        return [dict(row) for row in found]

    def rewrite(self, table: str, column: str, ids: list[int], to_id: int) -> int:
        return self.database.update(Statement(f'UPDATE "{table}" SET "{column}" = ? WHERE "{column}" IN ({self.marks(ids)})', [to_id, *ids]))

    def pair_rewrite(self, table: str, model_column: str, id_column: str, models: tuple[str, ...], ids: list[int], to_id: int) -> int:
        return self.database.update(Statement(f'UPDATE "{table}" SET "{id_column}" = ? WHERE "{model_column}" IN ({self.marks(list(models))}) AND "{id_column}" IN ({self.marks(ids)})',
                                              [to_id, *models, *ids]))

    def delete(self, table: str, ids: list[int]) -> int:
        return self.database.update(Statement(f'DELETE FROM "{table}" WHERE id IN ({self.marks(ids)})', list(ids))) if ids else 0

    def unique_keys(self) -> list[tuple[str, tuple[str, ...]]]:
        found = []
        for index in self.database.rows(UNIQUE_INDEXES):
            columns = self.database.rows(Statement(f'SELECT name FROM pragma_index_info("{index["index_name"]}")', scan_reason=SCHEMA_REASON))
            found.append((index["table_name"], tuple(str(column["name"]) for column in columns if column["name"] is not None)))
        return found

    def table_counts(self, tables: list[str]) -> dict[str, int]:
        return {table: int(self.database.rows(Statement(f'SELECT count(*) AS n FROM "{table}"', scan_reason=SCHEMA_REASON))[0]["n"]) for table in tables}

    def broken_keys(self) -> list[str]:
        return [json.dumps(dict(row)) for row in self.database.rows(Statement("PRAGMA foreign_key_check", scan_reason=SCHEMA_REASON))]

    def is_intact(self) -> bool:
        return self.database.rows(Statement("PRAGMA integrity_check", scan_reason=SCHEMA_REASON))[0][0] == "ok"

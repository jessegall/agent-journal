
from engine.database.database import Database
from engine.database.statement import Statement
from engine.database.schema_column import SchemaColumn

TABLE_COLUMNS = Statement("SELECT tables.name AS table_name, columns.name AS column_name FROM sqlite_master AS tables, pragma_table_info(tables.name) AS columns"
                          " WHERE tables.type = 'table' AND tables.name NOT LIKE 'sqlite_%' ORDER BY tables.name, columns.cid",
                          scan_reason="The fold reads the fixed schema catalogue to find every column that holds an agent, not stored journal rows.")
FOREIGN_KEYS = Statement("SELECT tables.name AS table_name, keys.\"from\" AS column_name, keys.\"table\" AS target FROM sqlite_master AS tables,"
                         " pragma_foreign_key_list(tables.name) AS keys WHERE tables.type = 'table' ORDER BY tables.name, keys.\"from\"",
                         scan_reason="The fold reads the fixed schema catalogue to find every column that holds an agent, not stored journal rows.")


class SchemaColumns:
    """Reads every column of every table of the live schema with the table its foreign key names."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def columns(self) -> tuple[SchemaColumn, ...]:
        targets = {(row["table_name"], row["column_name"]): row["target"] for row in self.database.rows(FOREIGN_KEYS)}
        return tuple(SchemaColumn(row["table_name"], row["column_name"], targets.get((row["table_name"], row["column_name"])))
                     for row in self.database.rows(TABLE_COLUMNS))

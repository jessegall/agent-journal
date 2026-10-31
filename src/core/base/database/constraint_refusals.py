import re
import sqlite3

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.model.table import Table, indefinite_article
from core.base.refusal import Refusal

RULE_PREFIX = "rule: "
UNIQUE_COLUMNS = re.compile(r"UNIQUE constraint failed: (.+)")
TABLE_CHECK = re.compile(r"CHECK constraint failed: (.+)")
MISSING_VALUE_COLUMN = re.compile(r"NOT NULL constraint failed: \w+\.(\w+)")
ENVIRONMENT_COLUMN = "environment_id"
REFERENCING_TABLES = Statement("SELECT DISTINCT tables.name FROM sqlite_master AS tables, pragma_foreign_key_list(tables.name) AS keys"
                      " WHERE tables.type = 'table' AND keys.\"table\" = ? ORDER BY tables.name")


class ConstraintRefusals:
    """Converts a database rule violation into a refusal a person can understand."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def refusal(self, error: sqlite3.IntegrityError, table: Table, deletion: bool) -> Refusal:
        message, cli_name = str(error), table.cli_name
        if message.startswith(RULE_PREFIX):
            return Refusal(message.removeprefix(RULE_PREFIX))
        unique = UNIQUE_COLUMNS.match(message)
        if unique:
            columns = ", ".join(column.split(".")[-1] for column in unique.group(1).split(", "))
            return Refusal(f"{indefinite_article(cli_name)} {cli_name} with that {columns} exists already")
        missing_value = MISSING_VALUE_COLUMN.match(message)
        if missing_value:
            column = missing_value.group(1)
            if column == ENVIRONMENT_COLUMN:
                return Refusal(f"{indefinite_article(cli_name)} {cli_name} needs an environment", "name it with --environment")
            return Refusal(f"{indefinite_article(cli_name)} {cli_name} needs a value for {column}")
        table_check = TABLE_CHECK.match(message)
        if table_check:
            return Refusal(f"{indefinite_article(cli_name)} {cli_name} must keep to {table_check.group(1)}")
        if message == "FOREIGN KEY constraint failed" and deletion:
            return Refusal(f"this {cli_name} is still referred to by {', '.join(self.referencing_tables(table.name))}", "remove or move those first")
        if message == "FOREIGN KEY constraint failed":
            return Refusal(f"this {cli_name} refers to a row that does not exist", "check the ids it names")
        raise error

    def referencing_tables(self, table: str) -> list[str]:
        return [row["name"] for row in self.database.rows(Statement(REFERENCING_TABLES.sql, [table]))]

import re
import sqlite3

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.refusal import Refusal

RULE_PREFIX = "rule: "
UNIQUE_COLUMNS = re.compile(r"UNIQUE constraint failed: (.+)")
REFERRERS = Statement("SELECT DISTINCT tables.name FROM sqlite_master AS tables, pragma_foreign_key_list(tables.name) AS keys"
                      " WHERE tables.type = 'table' AND keys.\"table\" = ? ORDER BY tables.name")


class ConstraintFault:
    """Turns a database rule violation into a refusal a person can understand."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def refusal(self, fault: sqlite3.IntegrityError, table: str, noun: str) -> Refusal:
        message = str(fault)
        if message.startswith(RULE_PREFIX):
            return Refusal(message.removeprefix(RULE_PREFIX))
        unique = UNIQUE_COLUMNS.match(message)
        if unique:
            columns = ", ".join(column.split(".")[-1] for column in unique.group(1).split(", "))
            return Refusal(f"a {noun} with that {columns} exists already")
        if message == "FOREIGN KEY constraint failed":
            return Refusal(f"this {noun} is still referred to by {', '.join(self.referrers(table))}", "remove or move those first")
        raise fault

    def referrers(self, table: str) -> list[str]:
        return [row["name"] for row in self.database.rows(Statement(REFERRERS.sql, (table,)))]

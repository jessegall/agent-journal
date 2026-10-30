import sqlite3
from dataclasses import dataclass


@dataclass(frozen=True)
class Statement:
    """SQL text and its parameters, in the order the text's placeholders take them."""

    sql: str
    parameters: tuple[object, ...] = ()

    def joined(self, tail: "Statement", separator: str = " ") -> "Statement":
        return Statement(f"{self.sql}{separator}{tail.sql}", self.parameters + tail.parameters)

    @classmethod
    def all_joined(cls, statements: tuple["Statement", ...], separator: str) -> "Statement":
        return Statement(separator.join(statement.sql for statement in statements), tuple(parameter for statement in statements for parameter in statement.parameters))

    def result(self, connection: sqlite3.Connection) -> sqlite3.Cursor:
        return connection.execute(self.sql, self.parameters)

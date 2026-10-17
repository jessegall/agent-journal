import re

from journal.db.connection import Connection
from journal.models.ref import Ref

TABLE = re.compile(r"^[a-z_]+$")


class Rows:
    """Any row read by its reference alone, as tasks:12, for what knows a row only by where it points."""

    def __init__(self, connection: Connection) -> None:
        self.connection = connection

    def state_of(self, ref: Ref) -> str:
        """The row's state, empty when the row is gone."""
        if not TABLE.match(ref.type):
            return ""
        row = self.connection.one(f"SELECT state FROM {ref.type} WHERE id = ?", (ref.id,))
        return row["state"] if row else ""

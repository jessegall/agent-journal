from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class LineToolUses(Migration):
    """Every line the journal said before lines carried the agent's tool use, and its moment, gains them: the tool use as zero and the moment as the row's creation, so a read of the last line of a kind never meets a row without them."""

    number: ClassVar[int] = 37

    def apply(self, connection: Connection) -> None:
        connection.execute("UPDATE entries SET data = json_set(data, '$.tool_use', 0) WHERE kind = 'nudge' AND json_extract(data, '$.tool_use') IS NULL")
        connection.execute("UPDATE entries SET data = json_set(data, '$.time', CAST(strftime('%s', created_at) AS REAL)) WHERE kind = 'nudge' AND json_extract(data, '$.time') IS NULL")

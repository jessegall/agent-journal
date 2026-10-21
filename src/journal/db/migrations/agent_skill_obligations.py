import json
from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class AgentSkillObligations(Migration):
    """A skill an agent owed was a link from its row with no other end; it is now a fact on the row, and those links go."""

    number: ClassVar[int] = 7

    def up(self, connection: Connection) -> None:
        owed: dict[str, list[str]] = {}
        for row in connection.all("SELECT source, kind FROM links WHERE target IS NULL AND kind LIKE 'owes:%' ORDER BY id"):
            owed.setdefault(row["source"], []).append(row["kind"].removeprefix("owes:"))
        for source, names in owed.items():
            connection.execute("UPDATE agents SET skills_owed = ? WHERE id = ?", (json.dumps(list(dict.fromkeys(names))), int(source.removeprefix("agents:"))))
        connection.execute("DELETE FROM links WHERE target IS NULL AND kind LIKE 'owes:%'")

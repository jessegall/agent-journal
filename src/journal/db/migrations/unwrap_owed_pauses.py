import json
from datetime import datetime, timezone
from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration

OWED = ("orienting", "at_mark", "loading_skill")
"""The pause states that became facts on the agent's row in plan 7's phase two."""


class UnwrapOwedPauses(Migration):
    """An agent standing in a pause it owed the journal goes back to the state the pause interrupted, with the matching fact set: not oriented, the mark owed, the skill owed as a link; never dropped to idle."""

    number: ClassVar[int] = 1

    def up(self, connection: Connection) -> None:
        now = datetime.now(timezone.utc).isoformat()
        for row in connection.all(f"SELECT id, state, data FROM agents WHERE state IN ({', '.join('?' for _ in OWED)})", OWED):
            state, data, facts = row["state"], json.loads(row["data"] or "{}"), {"oriented": 1, "mark_owed": 0, "skills": []}
            while state in OWED:
                self.owe(state, data, facts)
                resume = data.get("resume") or {}
                state, data = resume.get("state", "idle"), resume.get("data") or {}
            connection.execute("UPDATE agents SET state = ?, data = ?, oriented = ?, mark_owed = ?, updated_at = ?, updated_by = ? WHERE id = ?", (state, json.dumps(data), facts["oriented"], facts["mark_owed"], now, "system", row["id"]))
            for skill in facts["skills"]:
                connection.execute("INSERT INTO links (created_at, created_by, updated_at, updated_by, source, target, kind) VALUES (?, ?, ?, ?, ?, NULL, ?)", (now, "system", now, "system", f"agents:{row['id']}", f"owes:{skill}"))

    @staticmethod
    def owe(state: str, data: dict, facts: dict) -> None:
        if state == "orienting":
            facts["oriented"] = 0
        elif state == "at_mark":
            facts["mark_owed"] = max(facts["mark_owed"], int(data.get("mark", 0)))
        elif state == "loading_skill" and data.get("skill"):
            facts["skills"].append(data["skill"])

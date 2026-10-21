import json
from datetime import datetime, timezone
from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration
from journal.db.migrations.owed_facts import OwedFacts
from journal.db.migrations.stored_state import StoredState

OWED = ("orienting", "at_mark", "loading_skill")


class UnwrapOwedPauses(Migration):
    """An agent snapshot in a pause it owed the journal goes back to the state the pause interrupted, with the matching fact set: not oriented, the mark owed, the skill owed as a link; never dropped to idle."""

    number: ClassVar[int] = 1

    def up(self, connection: Connection) -> None:
        now = datetime.now(timezone.utc).isoformat()
        for row in connection.all(f"SELECT id, state, data FROM agents WHERE state IN ({', '.join('?' for _ in OWED)})", OWED):
            state, facts = StoredState.from_json(row["state"], json.loads(row["data"] or "{}")), OwedFacts()
            while state.name in OWED:
                facts = facts.owing(state.name, int(state.data.get("mark", 0)), state.data.get("skill", ""))
                state = state.resumed()
            connection.execute("UPDATE agents SET state = ?, data = ?, oriented = ?, mark_owed = ?, updated_at = ?, updated_by = ? WHERE id = ?", (state.name, json.dumps(state.to_json()), int(facts.oriented), facts.mark_owed, now, "system", row["id"]))
            for skill in facts.skills:
                connection.execute("INSERT INTO links (created_at, created_by, updated_at, updated_by, source, target, kind) VALUES (?, ?, ?, ?, ?, NULL, ?)", (now, "system", now, "system", f"agents:{row['id']}", f"owes:{skill}"))

import json
from datetime import datetime, timezone
from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration
from journal.db.migrations.obligation_facts import ObligationFacts
from journal.db.migrations.stored_state import StoredState

OBLIGATION_STATES = ("orienting", "at_mark", "loading_skill")


class PauseUnwrapping(Migration):
    """An agent in a pause it owed the journal goes back to the state the pause interrupted, with the matching fact set: not oriented, the mark owed, the skill owed as a link; never dropped to idle."""

    number: ClassVar[int] = 1

    def apply(self, connection: Connection) -> None:
        time = datetime.now(timezone.utc).isoformat()
        for row in connection.all(f"SELECT id, state, data FROM agents WHERE state IN ({', '.join('?' for _ in OBLIGATION_STATES)})", OBLIGATION_STATES):
            state, facts = StoredState.parsed(row["state"], json.loads(row["data"] or "{}")), ObligationFacts()
            while state.name in OBLIGATION_STATES:
                facts = facts.obligation(state.name, int(state.data.get("mark", 0)), state.data.get("skill", ""))
                state = state.resumed()
            connection.execute("UPDATE agents SET state = ?, data = ?, has_overview = ?, threshold_due = ?, updated_at = ?, updater = ? WHERE id = ?", (state.name, json.dumps(state.serialized()), int(facts.has_overview), facts.threshold_due, time, "system", row["id"]))
            for skill in facts.skills:
                connection.execute("INSERT INTO links (created_at, creator, updated_at, updater, source, target, kind) VALUES (?, ?, ?, ?, ?, NULL, ?)", (time, "system", time, "system", f"agents:{row['id']}", f"owes:{skill}"))

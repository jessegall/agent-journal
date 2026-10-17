import json
from datetime import datetime, timezone
from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration

RUNNING = "running_sequence"


class UnwrapRunningSequences(Migration):
    """An agent with a running sequence anywhere in its state or resume chain goes back to the state the run interrupted, the runs kept on its row in the order they were started."""

    number: ClassVar[int] = 3

    def up(self, connection: Connection) -> None:
        now = datetime.now(timezone.utc).isoformat()
        sequences = {row["id"]: row for row in connection.all("SELECT id, title, steps FROM sequences")}
        for row in connection.all("SELECT id, state, data, sequence_runs FROM agents WHERE state = ? OR data LIKE ?", (RUNNING, f'%"{RUNNING}"%')):
            state, data, found = self.unwrapped(row["state"], json.loads(row["data"] or "{}"))
            runs = [*json.loads(row["sequence_runs"] or "[]"), *(self.run(raw, sequences) for raw in found)]
            connection.execute("UPDATE agents SET state = ?, data = ?, sequence_runs = ?, updated_at = ?, updated_by = ? WHERE id = ?", (state, json.dumps(data), json.dumps(runs), now, "system", row["id"]))

    def unwrapped(self, state: str, data: dict) -> tuple[str, dict, list[dict]]:
        """The state with every running sequence layer taken out, and those layers' data, the innermost first."""
        resume = data.get("resume")
        inner_state, inner_data, found = self.unwrapped(resume.get("state", "idle"), resume.get("data") or {}) if resume else ("idle", {}, [])
        if state == RUNNING:
            return inner_state, inner_data, [*found, data]
        return state, {**data, "resume": {"state": inner_state, "data": inner_data}} if resume else data, found

    @staticmethod
    def run(raw: dict, sequences: dict) -> dict:
        sequence = sequences.get(raw.get("sequence_id"))
        steps = json.loads(sequence["steps"]) if sequence else [raw.get("text", "")]
        step = min(int(raw.get("step", 0)), len(steps) - 1) if sequence else 0
        return {"sequence_id": raw.get("sequence_id", 0), "title": sequence["title"] if sequence else "", "steps": steps, "step": step, "about": "", "taken_up": False, "parked_why": ""}

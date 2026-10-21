import json
from datetime import datetime, timezone
from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration
from journal.db.migrations.stored_state import StoredState
from journal.support.sequence_run import SequenceRun

RUNNING = "running_sequence"


class UnwrapRunningSequences(Migration):
    """An agent with a running sequence anywhere in its state or resume chain goes back to the state the run interrupted, the runs kept on its row in the order they were started."""

    number: ClassVar[int] = 3

    def up(self, connection: Connection) -> None:
        time = datetime.now(timezone.utc).isoformat()
        sequences = {row["id"]: row for row in connection.all("SELECT id, title, steps FROM sequences")}
        for row in connection.all("SELECT id, state, data, sequence_runs FROM agents WHERE state = ? OR data LIKE ?", (RUNNING, f'%"{RUNNING}"%')):
            unwrapped = StoredState.from_json(row["state"], json.loads(row["data"] or "{}")).without(RUNNING)
            runs = [*json.loads(row["sequence_runs"] or "[]"), *(self.run(layer.data.get("sequence_id", 0), int(layer.data.get("step", 0)), layer.data.get("text", ""), sequences, time).as_dict() for layer in unwrapped.taken)]
            connection.execute("UPDATE agents SET state = ?, data = ?, sequence_runs = ?, updated_at = ?, updated_by = ? WHERE id = ?", (unwrapped.state.name, json.dumps(unwrapped.state.to_json()), json.dumps(runs), time, "system", row["id"]))

    @staticmethod
    def run(sequence_id: int, step: int, text: str, sequences: dict, time: str) -> SequenceRun:
        sequence = sequences.get(sequence_id)
        if sequence is None:
            return SequenceRun(sequence_id, f"sequence {sequence_id}", (text,), started_at=time, said_at=time)
        steps = tuple(json.loads(sequence["steps"]))
        return SequenceRun(sequence_id, sequence["title"], steps, min(step, len(steps) - 1), started_at=time, said_at=time)

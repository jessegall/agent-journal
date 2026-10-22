import json
from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration

RENAMED = {
    "idle": {"parked_asked": "suspension_reported", "quiet_since": "silenced_at"},
    "working": {"what": "focus"},
    "following_plan": {"at_checkpoint": "checkpoint_pause", "moved_from": "origin_state", "what": "focus"},
    "awaiting": {"ends_on": "end_refs", "next_task_named": "next_task_reported", "what": "focus"},
    "stuck": {"why": "reason"},
}
RUN_FIELDS = {"about": "subject", "parked_why": "suspension_reason", "said_at": "announced_at", "taken_up_at": "adopted_at", "finishes_in": "end_condition"}
FAMILY = {"orchestrating": "idle", "soloing": "idle", "orchestrating_plan": "following_plan", "delegating": "working"}


class StateFieldRenames(Migration):
    """The fields of the states and the sequence runs stored on an agent's row take the names the plain-name rules gave them, so a waiting or paused agent and a running sequence keep their counts, times and targets."""

    number: ClassVar[int] = 25

    def apply(self, connection: Connection) -> None:
        for row in connection.all("SELECT id, state, data, stack, sequence_runs FROM agents"):
            stack = [{**layer, "data": renamed(layer["state"], layer.get("data") or {})} for layer in json.loads(row["stack"] or "[]")]
            data = renamed(row["state"], json.loads(row["data"] or "{}"))
            runs = [{RUN_FIELDS.get(key, key): value for key, value in run.items()} for run in json.loads(row["sequence_runs"] or "[]")]
            connection.execute("UPDATE agents SET stack = ?, data = ?, sequence_runs = ? WHERE id = ?", (json.dumps(stack), json.dumps(data), json.dumps(runs), row["id"]))


def renamed(state: str, data: dict) -> dict:
    names = RENAMED.get(FAMILY.get(state, state), {})
    return {names.get(key, key): value for key, value in data.items()}

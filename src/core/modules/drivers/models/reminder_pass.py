import json
from collections.abc import Mapping
from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class ReminderPass(Model):
    """How many times in a row an agent let a repeating reminder pass for each thing it names, and when each was
    counted last, kept as JSON from the thing to its count and moment."""

    model_name = "reminder_pass"
    cli_name = "reminder-pass"
    shared_rows = True

    session_agent_id: int
    creator_id: int
    key: str
    counts: str = "{}"

    def subject_counts(self) -> dict[str, tuple[int, Timestamp]]:
        return {subject: (passes, Timestamp.parsed(counted_at)) for subject, (passes, counted_at) in json.loads(self.counts).items()}

    @staticmethod
    def counts_text(counts: Mapping[str, tuple[int, Timestamp]]) -> str:
        return json.dumps({subject: [passes, counted_at.text] for subject, (passes, counted_at) in counts.items()})

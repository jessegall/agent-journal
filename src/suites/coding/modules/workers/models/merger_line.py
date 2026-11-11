from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome

CLOCK_FORMAT = "%H:%M"


@dataclass(frozen=True, kw_only=True)
class MergerLine(EnvironmentScoped, Model):
    """A line about a worker that waits for the merger to read it, in place of reaching the main agent. A line
    with a worker is that worker's question: it records its wait, its task, when an answer is due, when it is
    forwarded to the main agent, how often a merger read it, and how and when it ended."""

    model_name = "merger_line"
    cli_name = "merger-line"
    hidden_fields = frozenset(["nudge_json", "facts_json"])

    environment_id: int = 0
    text: str
    fallback_source: str
    read_at: Timestamp | None = None
    nudge_json: str | None = None
    read_output_id: int | None = None
    topic: AskTopic | None = None
    facts_json: str | None = None
    worker_id: int | None = None
    group_key: str | None = None
    visit_id: int | None = None
    returned_at: Timestamp | None = None
    wait_id: int | None = None
    task_id: int | None = None
    outcome: AskOutcome | None = None
    closed_at: Timestamp | None = None
    due_at: Timestamp | None = None
    forward_at: Timestamp | None = None
    visit_count: int = 0
    source_key: str | None = None

    def is_recent_repeat(self, activity_at: Timestamp, timestamp: Timestamp, repeat_seconds: float) -> bool:
        if self.creation_timestamp() < activity_at:
            return False
        return self.is_open_question() or self.creation_timestamp().elapsed_seconds(timestamp) < repeat_seconds

    def status_text(self) -> str:
        if self.outcome is not None:
            return f"ask {self.id} was {self.outcome.description()}"
        asked = self.creation_timestamp().value.strftime(CLOCK_FORMAT)
        due = f", answer due {self.due_at.value.strftime(CLOCK_FORMAT)}" if self.due_at is not None else ""
        return f"ask {self.id} open since {asked}{due}, with the merger"

    def is_open_question(self) -> bool:
        return self.worker_id is not None and self.outcome is None

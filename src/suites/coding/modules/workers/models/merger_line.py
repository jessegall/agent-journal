from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp
from suites.coding.models.enums.ask_topic import AskTopic


@dataclass(frozen=True, kw_only=True)
class MergerLine(EnvironmentScoped, Model):
    """A line about a worker that waits for the merger to read it, in place of reaching the main agent."""

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

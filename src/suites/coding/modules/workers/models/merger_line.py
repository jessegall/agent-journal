from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class MergerLine(EnvironmentScoped, Model):
    """A line about a worker that waits for the merger to read it, in place of reaching the main agent."""

    model_name = "merger_line"
    cli_name = "merger-line"
    hidden_fields = frozenset(["nudge_json"])

    environment_id: int = 0
    text: str
    fallback_source: str
    read_at: Timestamp | None = None
    nudge_json: str | None = None

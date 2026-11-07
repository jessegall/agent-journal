from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class MergerLine(Model):
    """A line about a worker that waits for the merger to read it, in place of reaching the main agent."""

    model_name = "merger_line"
    cli_name = "merger-line"

    environment_id: int = 0
    text: str
    fallback_source: str
    read_at: Timestamp | None = None

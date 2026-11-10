from dataclasses import dataclass

from core.base.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class ProviderOutage(Model):
    """A program that gets no new agents until a time, and why."""

    model_name = "provider_outage"
    cli_name = "provider-outage"
    search_fields = ["program", "reason"]

    program: str
    creator_id: int
    reason: str
    ends_at: Timestamp

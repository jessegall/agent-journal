from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class MergerVisit(EnvironmentScoped, Model):
    """One reading of the merger's waiting lines: the merger gives a worker at most one advice per reading."""

    model_name = "merger_visit"
    cli_name = "merger-visit"

    environment_id: int = 0
    closed_at: Timestamp | None = None

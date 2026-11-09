from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class MergerVisit(EnvironmentScoped, Model):
    """One reading of the merger's waiting lines: the merger gives a worker at most one advice per reading."""

    model_name = "merger_visit"
    cli_name = "merger-visit"

    environment_id: int = 0

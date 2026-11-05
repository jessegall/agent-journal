from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Dock(EnvironmentScoped, Model):
    """The one dock above an environment's chat, which holds its docked items."""

    model_name = "dock"
    cli_name = "dock"

    environment_id: int = 0
    creator_id: int

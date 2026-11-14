from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Dock(EnvironmentScoped, Model):
    """The one dock above an environment's chat, which holds its docked items."""

    model_name = "dock"
    cli_name = "dock"

    environment_id: int = 0
    creator_id: int

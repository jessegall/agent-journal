from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Dock(Model):
    """The one dock above an environment's chat, which holds its docked items."""

    model_name = "dock"
    cli_name = "dock"

    environment_id: int
    creator_id: int

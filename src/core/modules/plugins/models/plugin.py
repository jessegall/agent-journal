from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Plugin(Model):
    """A program the person installed that hears the journal's events: where it came from, its version, and
    whether it is switched on."""

    model_name = "plugin"
    cli_name = "plugin"

    creator_id: int
    name: str
    title: str
    source: str
    release: str
    enabled: bool = True

from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Plugin(Model):
    """A program the person installed that hears the journal's events: where it came from, its version, whether
    it is switched on, and the digest of its files when the person last installed or switched it on."""

    model_name = "plugin"
    cli_name = "plugin"

    creator_id: int
    name: str
    title: str
    source: str
    release: str
    enabled: bool = True
    files_digest: str = ""

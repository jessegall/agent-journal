from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Release(Model):
    """A release installed into the journal's code: the SHA-256 of its archive, which tells it apart from
    every other release, its tag when the address named one, and who installed it."""

    model_name = "release"
    cli_name = "release"

    creator_id: int
    checksum: str
    tag: str = ""

from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Link(Model):
    """A link from one row to another, each written table:number, with what the link means: about, mentions or
    comments_on."""

    model_name = "link"
    cli_name = "link"

    creator_id: int
    source: str
    target: str
    link_type: str

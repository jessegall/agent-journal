from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.documents.models.enums.link_type import LinkType


@dataclass(frozen=True, kw_only=True)
class Link(Model):
    """A link from one row to another, each named by its model and number, with what the link means."""

    model_name = "link"
    cli_name = "link"

    creator_id: int
    source_model: str
    source_id: int
    target_model: str
    target_id: int
    link_type: LinkType

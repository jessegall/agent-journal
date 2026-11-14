from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from core.modules.documents.models.enums.link_type import LinkType


@dataclass(frozen=True, kw_only=True)
class LinkCorrection(EnvironmentScoped, Model):
    """Keeps a removed attribution from being recreated automatically."""

    model_name = "link_correction"
    cli_name = "link-correction"

    creator_id: int
    environment_id: int = 0
    link_id: int
    link_creator_id: int
    source_model: str
    source_id: int
    target_model: str
    target_id: int
    link_type: LinkType

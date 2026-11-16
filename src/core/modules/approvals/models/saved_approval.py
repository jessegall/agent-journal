from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from core.modules.approvals.models.enums.saved_scope import SavedScope


@dataclass(frozen=True, kw_only=True)
class SavedApproval(EnvironmentScoped, Model):
    """A user's saved yes in an environment: a later request it covers is accepted at once, as that user, with
    no card. SavedScope.SAME covers the same category of approval with the same command line or command;
    SavedScope.LIKE covers the same category and the same target, whatever else follows."""

    model_name = "saved_approval"
    cli_name = "saved-approval"
    search_fields = ["text"]

    environment_id: int = 0
    creator_id: int
    scope: SavedScope
    category: str
    target: str
    match_key: str
    text: str

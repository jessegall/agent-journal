from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from core.modules.approvals.models.enums.standing_scope import StandingScope


@dataclass(frozen=True, kw_only=True)
class StandingApproval(EnvironmentScoped, Model):
    """A user's standing yes in an environment: a later request it covers is accepted at once, as that user, with
    no card. StandingScope.SAME covers the same kind of approval with the same command line or command;
    StandingScope.LIKE covers the same kind and the same target, whatever else follows."""

    model_name = "standing_approval"
    cli_name = "standing-approval"
    search_fields = ["text"]

    environment_id: int = 0
    creator_id: int
    scope: StandingScope
    kind: str
    target: str
    match_key: str
    text: str

from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model
from core.modules.approvals.models.enums.standing_scope import StandingScope


@dataclass(frozen=True, kw_only=True)
class StandingApproval(EnvironmentScoped, Model):
    """A person's standing yes in an environment: a later request it covers is accepted at once, as that
    person, with no card. SAME covers the same kind of approval with the same command line or command; LIKE
    covers the same kind and the same target, whatever else follows."""

    model_name = "standing_approval"
    cli_name = "standing-approval"
    search_fields = ["text"]

    environment_id: int = 0
    creator_id: int
    scope: StandingScope
    category: str
    target: str
    match_key: str
    text: str

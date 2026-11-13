from dataclasses import dataclass

from engine.command.command import Command
from core.modules.approvals.models.enums.standing_scope import StandingScope
from core.modules.approvals.models.standing_approval import StandingApproval


@dataclass(frozen=True)
class MakeStandingApproval(Command[StandingApproval]):
    """Keeps a user's standing yes for the request they just accepted."""

    request_id: int
    scope: StandingScope

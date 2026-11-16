from dataclasses import dataclass

from engine.command.command import Command
from core.modules.approvals.models.enums.saved_scope import SavedScope
from core.modules.approvals.models.saved_approval import SavedApproval


@dataclass(frozen=True)
class MakeSavedApproval(Command[SavedApproval]):
    """Keeps a user's saved yes for the request they just accepted."""

    request_id: int
    scope: SavedScope

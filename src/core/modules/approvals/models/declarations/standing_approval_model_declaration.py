from engine.module.model_declaration import ModelDeclaration
from core.modules.approvals.models.standing_approval import StandingApproval


class StandingApprovalModelDeclaration(ModelDeclaration):
    """How the module declares StandingApproval."""

    model = StandingApproval
    excluded_subcommands = ["make", "edit"]

from engine.module.model_declaration import ModelDeclaration
from core.modules.approvals.models.saved_approval import SavedApproval


class SavedApprovalModelDeclaration(ModelDeclaration):
    """How the module declares SavedApproval."""

    model = SavedApproval
    excluded_subcommands = ["make", "edit"]

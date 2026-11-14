from engine.module.model_declaration import ModelDeclaration
from core.modules.approvals.models.approval_request import ApprovalRequest


class ApprovalRequestModelDeclaration(ModelDeclaration):
    """How the module declares ApprovalRequest."""

    model = ApprovalRequest
    excluded_subcommands = ["make", "edit", "delete", "begin", "accept", "refuse", "retry", "fail", "close"]

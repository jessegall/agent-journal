from engine.chat.dock_declaration import DockDeclaration
from core.modules.approvals.models.enums.approval_dock_type import ApprovalDockType


class RequestDock(DockDeclaration):
    """The dock of ApprovalDockType.REQUEST."""

    type = ApprovalDockType.REQUEST
    icon = "question"
    title = "Approval"
    body = "approval-dock.js"
    reads = ["approval pending"]
    person_required = True
    reads_target = False

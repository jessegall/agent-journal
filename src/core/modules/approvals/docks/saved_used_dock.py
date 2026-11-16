from engine.chat.dock_declaration import DockDeclaration
from core.modules.approvals.models.enums.approval_dock_type import ApprovalDockType
from engine.chat.mark_button import MarkButton


class SavedUsedDock(DockDeclaration):
    """The dock of ApprovalDockType.SAVED_USED."""

    type = ApprovalDockType.SAVED_USED
    icon = "check"
    title = "Approval automatically accepted"
    body = "saved-used-dock.js"
    reads = ["saved-approval show"]
    buttons = [MarkButton("close", "Withdraw", "saved-approval delete {row_id}")]
    leaves_after_seconds = 8

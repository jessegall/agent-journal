from engine.chat.dock_declaration import DockDeclaration
from core.modules.approvals.models.enums.approval_dock_type import ApprovalDockType
from engine.chat.mark_button import MarkButton


class StandingUsedDock(DockDeclaration):
    """The dock of ApprovalDockType.STANDING_USED."""

    type = ApprovalDockType.STANDING_USED
    icon = "check"
    title = "Approval automatically accepted"
    body = "standing-used-dock.js"
    reads = ["standing-approval show"]
    buttons = [MarkButton("close", "Withdraw", "standing-approval delete {row_id}")]
    leaves_after_seconds = 8

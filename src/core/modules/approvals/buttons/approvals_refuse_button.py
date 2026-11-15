from engine.viewer.button_declaration import ButtonDeclaration
from core.modules.approvals.support.approval_buttons import APPROVAL_SLOT
from core.modules.approvals.support.approval_buttons import OPEN_REQUEST


class ApprovalsRefuseButton(ButtonDeclaration):
    """The button approvals.refuse."""

    name = "approvals.refuse"
    slots = APPROVAL_SLOT
    label = "Refuse"
    runs = "approval refuse {row_id}"
    icon = "cross"
    condition = OPEN_REQUEST

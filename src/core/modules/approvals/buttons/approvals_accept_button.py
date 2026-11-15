from engine.viewer.button_declaration import ButtonDeclaration
from core.modules.approvals.support.approval_buttons import APPROVAL_SLOT
from engine.viewer.button_menu_item import ButtonMenuItem
from core.modules.approvals.support.approval_buttons import OPEN_REQUEST


class ApprovalsAcceptButton(ButtonDeclaration):
    """The button approvals.accept."""

    name = "approvals.accept"
    slots = APPROVAL_SLOT
    label = "Accept"
    runs = "approval accept {row_id}"
    icon = "check"
    primary = True
    condition = OPEN_REQUEST
    menu = (ButtonMenuItem("Accept and always for the same request", "approval accept {row_id} --always same", description="Keeps a standing yes: the same kind of approval with the same command line, in this environment, is accepted with no card."),
                                    ButtonMenuItem("Accept and always for any request like it", "approval accept {row_id} --always like", description="Keeps a standing yes: the same kind of approval for the same program or target, whatever follows it, is accepted with no card."))

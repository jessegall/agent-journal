from engine.chat.mark_declaration import MarkDeclaration
from core.modules.approvals.models.enums.approval_mark_type import ApprovalMarkType
from core.modules.approvals.models.enums.approval_mark_variant import ApprovalMarkVariant
from core.modules.approvals.support.approval_marks import APPROVALS_FAMILY


class ApprovalSavedMark(MarkDeclaration):
    """The mark ApprovalMarkType.SAVED."""

    type = ApprovalMarkType.SAVED
    variants = ApprovalMarkVariant
    family = APPROVALS_FAMILY
    label = "A saved yes accepted a request"
    mark_icon = "question"

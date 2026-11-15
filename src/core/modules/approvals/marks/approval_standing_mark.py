from engine.chat.mark_declaration import MarkDeclaration
from core.modules.approvals.models.enums.approval_mark_type import ApprovalMarkType
from core.modules.approvals.models.enums.approval_mark_variant import ApprovalMarkVariant
from core.modules.approvals.support.approval_marks import APPROVALS_FAMILY


class ApprovalStandingMark(MarkDeclaration):
    """The mark ApprovalMarkType.STANDING."""

    type = ApprovalMarkType.STANDING
    variants = ApprovalMarkVariant
    family = APPROVALS_FAMILY
    label = "A standing yes accepted a request"
    mark_icon = "question"

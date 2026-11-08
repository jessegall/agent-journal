from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.approvals.models.enums.approval_mark_type import ApprovalMarkType
from core.modules.approvals.models.enums.approval_mark_variant import ApprovalMarkVariant

APPROVALS_FAMILY = MarkFamily("approvals.standing", "Standing approvals", "question", MarkGroup.JOURNAL)
APPROVAL_MARKS = [MarkDeclaration(ApprovalMarkType.STANDING, ApprovalMarkVariant, APPROVALS_FAMILY, "A standing yes accepted a request", "question")]

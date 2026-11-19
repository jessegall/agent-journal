from dataclasses import dataclass

from engine.command.command import Command
from core.modules.approvals.models.enums.approval_decision import ApprovalDecision
from core.modules.approvals.models.enums.saved_scope import SavedScope
from core.modules.approvals.support.approval_result import ApprovalResult


@dataclass(frozen=True)
class AnswerApproval(Command[ApprovalResult]):
    row_id: int
    decision: ApprovalDecision
    saved: SavedScope | None = None

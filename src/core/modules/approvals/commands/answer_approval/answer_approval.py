from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.approvals.models.enums.approval_decision import ApprovalDecision
from core.modules.approvals.models.enums.standing_scope import StandingScope
from core.modules.approvals.support.approval_result import ApprovalResult


@dataclass(frozen=True)
class AnswerApproval(Command[ApprovalResult]):
    lock = False

    row_id: int
    decision: ApprovalDecision
    standing: StandingScope | None = None

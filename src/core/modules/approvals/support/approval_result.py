from dataclasses import dataclass

from core.modules.approvals.models.approval_request import ApprovalRequest


@dataclass(frozen=True)
class ApprovalResult:
    request: ApprovalRequest
    output: str

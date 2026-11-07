from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.approvals.models.approval_request import ApprovalRequest


@dataclass(frozen=True)
class AnswerAgentApproval(Command[ApprovalRequest]):
    request_id: int
    text: str

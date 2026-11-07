from dataclasses import dataclass

from core.base.command.command import Command
from core.base.model.move import Move
from core.modules.approvals.models.approval_request import ApprovalRequest


@dataclass(frozen=True)
class MoveApproval(Command[ApprovalRequest]):
    row_id: int
    move: Move

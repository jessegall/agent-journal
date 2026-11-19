from dataclasses import dataclass

from engine.command.command import Command
from engine.model.move import Move
from core.modules.approvals.models.approval_request import ApprovalRequest


@dataclass(frozen=True)
class MoveApproval(Command[ApprovalRequest]):
    row_id: int
    move: Move
    failure: str | None = None

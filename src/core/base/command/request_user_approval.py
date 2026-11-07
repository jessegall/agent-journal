from dataclasses import dataclass

from core.base.command.command import Command
from core.base.user_approval_refusal import UserApprovalRefusal


@dataclass(frozen=True)
class RequestUserApproval(Command[object]):
    approval: UserApprovalRefusal
    arguments: tuple[str, ...]
    requester_id: int | None = None

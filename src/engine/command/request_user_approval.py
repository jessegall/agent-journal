from dataclasses import dataclass

from engine.command.command import Command
from engine.command.errors.user_approval_refusal import UserApprovalRefusal


@dataclass(frozen=True)
class RequestUserApproval(Command[object]):
    approval: UserApprovalRefusal
    arguments: tuple[str, ...]
    requester_id: int | None = None
    why: str = ""

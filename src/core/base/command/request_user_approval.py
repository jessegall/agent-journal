from dataclasses import dataclass

from core.base.command.command import Command
from core.base.user_approval import UserApproval


@dataclass(frozen=True)
class RequestUserApproval(Command[object]):
    approval: UserApproval
    arguments: tuple[str, ...]
    requester_id: int | None = None

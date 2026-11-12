from dataclasses import dataclass

from engine.command.command import Command
from engine.command.errors.user_approval_refusal import UserApprovalRefusal


@dataclass(frozen=True)
class CheckApprovalWorks(Command[None]):
    """Tries the action an approval would run, as the user who would accept it, and keeps nothing."""

    lock = False

    approval: UserApprovalRefusal
    arguments: tuple[str, ...]

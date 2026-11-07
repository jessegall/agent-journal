from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.approvals.models.approval_request import ApprovalRequest


@dataclass(frozen=True)
class RequestSetting(Command[ApprovalRequest]):
    """Asks a person to change a setting only a person may change, with the reason the agent gives."""

    key: str
    text: str
    reason: str
    project: bool = False

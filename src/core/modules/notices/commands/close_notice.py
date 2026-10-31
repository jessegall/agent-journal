from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.notices.models.notice import Notice


@dataclass(frozen=True)
class CloseNotice(Command[Notice]):
    """Takes a notice off the chat."""

    notice_id: int

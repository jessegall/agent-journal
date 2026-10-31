from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.notices.models.notice import Notice


@dataclass(frozen=True)
class MakeNotice(Command[Notice]):
    """Pins a link above the chat of the caller's environment."""

    title: str
    link: str
    button_label: str

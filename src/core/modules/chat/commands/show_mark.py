from dataclasses import dataclass
from enum import StrEnum

from core.base.chat.mark_outcome import MarkOutcome
from core.base.command.command import Command
from core.modules.chat.models.chat_mark import ChatMark


@dataclass(frozen=True)
class ShowMark(Command[ChatMark]):
    """Shows a mark in an environment's chat, or brings the shown mark with the same key up to date."""

    environment_id: int
    type: StrEnum
    variant: StrEnum
    key: str
    text: str
    agent_id: int | None = None
    detail: str = ""
    row_model: str = ""
    row_id: int | None = None
    outcome: MarkOutcome = MarkOutcome.NONE
    figure: str = ""
    fraction: float = 0.0
    ended: bool = False

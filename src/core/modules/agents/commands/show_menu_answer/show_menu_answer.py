from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.chat.models.chat_mark import ChatMark


@dataclass(frozen=True)
class ShowMenuAnswer(Command[ChatMark]):
    """Shows in the chat what the launcher pressed on a menu in an agent's terminal."""

    agent_id: int
    question: str
    said: str

from dataclasses import dataclass

from engine.command.command import Command
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.updates.models.enums.update_step import UpdateStep


@dataclass(frozen=True)
class ShowUpdateStep(Command[ChatMark]):
    """Moves the chat mark of one `journal server update` to a step; detail is the new version when it is
    finished and the reason when it was refused."""

    run: str
    step: UpdateStep
    detail: str = ""

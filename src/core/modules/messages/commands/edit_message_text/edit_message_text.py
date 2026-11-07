from dataclasses import dataclass

from core.base.command.edit_command import EditCommand
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class EditMessageText(EditCommand[Message]):
    text: str

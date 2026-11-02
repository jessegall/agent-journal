from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.drivers.models.required_command import RequiredCommand


@dataclass(frozen=True)
class CloseRequiredCommand(Command[RequiredCommand]):
    """Closes a required_command: its command ran, or the reason says why it will not."""

    required_command_id: int
    skip_reason: str = ""

from dataclasses import dataclass

from engine.command.command import Command
from core.modules.secrets.models.secret import Secret


@dataclass(frozen=True)
class DeleteSecret(Command[Secret]):
    """Erases a secret for good: its row and every value of its fields, with nothing kept to restore."""

    secret_id: int

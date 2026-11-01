from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.secrets.models.secret import Secret


@dataclass(frozen=True)
class EditSecret(Command[Secret]):
    """Changes a secret's title or how it is used; an empty one keeps what it was."""

    secret_id: int
    title: str
    brief: str

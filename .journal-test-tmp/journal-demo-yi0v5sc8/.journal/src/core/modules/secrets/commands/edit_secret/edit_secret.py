from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.secrets.models.secret import Secret


@dataclass(frozen=True)
class EditSecret(Command[Secret]):
    """Changes a secret's title, how it is used or its fields; an empty title or use keeps what it was."""

    secret_id: int
    title: str
    brief: str
    added_fields: tuple[str, ...] = ()
    removed_fields: tuple[str, ...] = ()

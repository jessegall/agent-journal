from dataclasses import dataclass

from engine.command.command import Command
from core.modules.secrets.models.secret import Secret


@dataclass(frozen=True)
class ChangeSecretDeletion(Command[Secret]):
    """Puts a secret away, or brings a deleted one back; its values stay in the values file either way."""

    secret_id: int
    deleted: bool

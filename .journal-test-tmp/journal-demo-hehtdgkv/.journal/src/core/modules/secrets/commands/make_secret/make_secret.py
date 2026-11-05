from collections.abc import Sequence
from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.secrets.models.enums.secret_type import SecretType
from core.modules.secrets.models.secret import Secret


@dataclass(frozen=True)
class MakeSecret(Command[Secret]):
    """Makes a secret with its fields, empty until the user fills them; with a reason, it asks the user in the
    chat to fill it on the Secrets window."""

    title: str
    brief: str
    secret_type: SecretType
    field_names: Sequence[str] = ()
    reason: str = ""

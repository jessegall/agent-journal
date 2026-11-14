from dataclasses import dataclass

from core.modules.secrets.models.secret import Secret


@dataclass(frozen=True)
class SecretProgram:
    """A program just proposed for a secret or allowed, and whether it is new to the secret."""

    secret: Secret
    program: str
    is_new: bool

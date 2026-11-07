from dataclasses import dataclass

from core.modules.secrets.models.secret import Secret


@dataclass(frozen=True)
class SecretBoard:
    """The active and deleted secrets shown on the Secrets page."""

    active: tuple[Secret, ...]
    deleted: tuple[Secret, ...]

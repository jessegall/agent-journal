from dataclasses import dataclass

from core.modules.secrets.models.secret import Secret


@dataclass(frozen=True)
class FilledField:
    """A field just filled: its secret, its name and the file its value was read from, when it came from one.
    """

    secret: Secret
    field_name: str
    file: str

from dataclasses import dataclass, field

from engine.command.command import Command
from core.modules.secrets.commands.support.filled_field import FilledField


@dataclass(frozen=True)
class FillSecret(Command[FilledField]):
    """Puts one field's value in the values file and marks the field filled: a value the user typed on the
    Secrets window, or one the agent made, read from a file that is then deleted."""

    secret_id: int
    field_name: str
    value: str = field(default="", repr=False)
    file: str = ""

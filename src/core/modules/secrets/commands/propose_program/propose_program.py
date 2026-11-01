from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.secrets.commands.support.secret_program import SecretProgram


@dataclass(frozen=True)
class ProposeProgram(Command[SecretProgram]):
    """Proposes a program a secret may go to, for the user to allow on the Secrets window."""

    secret_id: int
    program: str

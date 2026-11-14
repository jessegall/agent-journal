from dataclasses import dataclass

from engine.command.command import Command
from core.modules.secrets.commands.support.secret_program import SecretProgram


@dataclass(frozen=True)
class AllowProgram(Command[SecretProgram]):
    """The user lets a secret go to a program, or lets the main agent's helpers use it."""

    secret_id: int
    program: str
    helpers: bool

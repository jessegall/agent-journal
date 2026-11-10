from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.secrets.commands.propose_program.propose_program import ProposeProgram
from core.modules.secrets.commands.support.secret_program import SecretProgram
from core.modules.secrets.queries.secret_query import SecretQuery
from core.modules.secrets.support.secret_programs import SecretPrograms


class ProposeProgramHandler(Handler[ProposeProgram, SecretProgram]):
    """Adds a program to a secret's proposed ones; a wrapper or a path is refused, and one proposed or allowed
    already is left as it is."""

    command = ProposeProgram

    def __init__(self, secrets: SecretQuery, repository: Repository) -> None:
        self.secrets, self.repository = secrets, repository

    def handle(self, command: ProposeProgram, context: Context) -> SecretProgram:
        secret = self.secrets.find(command.secret_id)
        if SecretPrograms.is_skipped(command.program):
            raise Refusal(f"a secret never goes to {command.program}", "propose the program that uses it, named bare, such as curl or gh")
        if command.program in (*secret.programs, *secret.proposed):
            return SecretProgram(secret, command.program, False)
        return SecretProgram(self.repository.save(secret.changed(proposed=(*secret.proposed, command.program)), context), command.program, True)

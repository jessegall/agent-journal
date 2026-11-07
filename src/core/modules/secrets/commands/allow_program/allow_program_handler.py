from core.base.user_approval import UserApproval
from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.secrets.commands.allow_program.allow_program import AllowProgram
from core.modules.secrets.commands.support.secret_program import SecretProgram
from core.modules.secrets.queries.secret_query import SecretQuery
from core.modules.secrets.support.secret_programs import SecretPrograms


class AllowProgramHandler(Handler[AllowProgram, SecretProgram]):
    """Adds a program to the ones a secret may go to, taking it from the proposed ones, or lets helpers use
    the secret; only the user allows, and never a wrapper or a path."""

    command = AllowProgram

    def __init__(self, secrets: SecretQuery, repository: Repository) -> None:
        self.secrets, self.repository = secrets, repository

    def handle(self, command: AllowProgram, context: Context) -> SecretProgram:
        secret = self.secrets.find(command.secret_id)
        if context.actor.type is not ActorType.USER:
            raise UserApproval(f"Change program access to the secret {secret.title}?")
        if command.program and SecretPrograms.is_skipped(command.program):
            raise Refusal(f"a secret never goes to {command.program}", "allow the program that uses it, named bare, such as curl or gh")
        allowed = secret.with_program(command.program) if command.program else secret
        return SecretProgram(self.repository.save_change(secret, allowed.changed(helpers=secret.helpers or command.helpers), context), command.program,
                             command.program not in secret.programs)

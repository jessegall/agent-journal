from core.base.user_approval_refusal import UserApprovalRefusal
from argparse import ArgumentParser, Namespace

from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.secrets.queries.secret_query import SecretQuery
from core.modules.secrets.support.secret_run import SecretRun
from core.modules.secrets.support.secret_run_outcome import SecretRunOutcome

SEPARATOR = "--"


class SecretRunSubcommand(ReadSubcommand[SecretRunOutcome]):
    """`journal secret run <n or title> [--stdin "<text with {field}>"] [--env] -- <program> <arguments>`: the
    secret given to a program the user allowed, and what it printed with every value masked; a helper of the
    main agent gets it only when the user lets helpers have it."""

    cli_name = "secret"
    name = "run"

    def __init__(self, secrets: SecretQuery, runner: SecretRun, queries: Queries) -> None:
        self.secrets, self.runner, self.queries = secrets, runner, queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("secret")
        parser.add_argument("--stdin", default="")
        parser.add_argument("--env", action="store_true")
        parser.add_argument("command", nargs="*")

    def read(self, arguments: Namespace, caller: Caller) -> SecretRunOutcome:
        deleted = [row for row in self.secrets.all_rows() if str(row.id) == arguments.secret and row.deleted_at is not None]
        if deleted:
            raise Refusal(f"secret {deleted[0].id} is deleted", f"journal secret restore {deleted[0].id} brings it back")
        secret = self.secrets.find_title(arguments.secret)
        if not secret.helpers and caller.actor.type is ActorType.AGENT and self.queries.query(Agent).find(caller.actor.id).role != AgentRole.MAIN:
            raise UserApprovalRefusal(f"Allow helpers to use the secret {secret.title} and run the requested command?",
                               ("secret", "allow", str(secret.id), "--helpers"), continued_arguments=self.run_arguments(arguments), returns_output=True)
        try:
            return self.runner.run(secret, [word for word in arguments.command if word != SEPARATOR], arguments.stdin, arguments.env)
        except UserApprovalRefusal as approval:
            approval.continued_arguments = self.run_arguments(arguments)
            raise

    @staticmethod
    def run_arguments(arguments: Namespace) -> tuple[str, ...]:
        flags = ("--stdin", arguments.stdin) if arguments.stdin else ()
        if arguments.env:
            flags = (*flags, "--env")
        command = tuple(word for word in arguments.command if word != SEPARATOR)
        return ("secret", "run", arguments.secret, *flags, SEPARATOR, *command)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, SecretRunOutcome):
            return
        ending = f"\n{value.program} ended with exit code {value.exit_code}" if value.exit_code else ""
        output.write(f"{value.output.rstrip()}{ending}", {"output": value.output, "exit_code": value.exit_code})

from argparse import Namespace
from collections.abc import Sequence

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.secrets.models.secret import Secret
from core.modules.secrets.queries.secret_query import SecretQuery


class SecretListSubcommand(ReadSubcommand[Sequence[Secret]]):
    """`journal secret list`: every secret, oldest first, with what it waits for and the programs
    it goes to."""

    cli_name = "secret"
    name = "list"

    def __init__(self, secrets: SecretQuery) -> None:
        self.secrets = secrets

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[Secret]:
        return tuple(self.secrets.oldest().get())

    def write_output(self, value: object, output: Output) -> None:
        listed = [row for row in value if isinstance(row, Secret)] if is_tuple(value) else []
        output.write("\n".join(self.line(row) for row in listed) or "no secrets yet",
                     {"rows": [{**output.values(row), "waiting": row.is_waiting()} for row in listed]})

    @staticmethod
    def line(secret: Secret) -> str:
        waiting = "  waiting for the user" if secret.is_waiting() else ""
        programs = f"  given to {', '.join(secret.programs)}" if secret.programs else ""
        return f"{secret.id}  {secret.secret_type}  {secret.title}{waiting}{programs}"

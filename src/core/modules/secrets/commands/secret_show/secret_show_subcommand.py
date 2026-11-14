from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.secrets.models.secret import Secret
from core.modules.secrets.queries.secret_query import SecretQuery


class SecretShowSubcommand(ReadSubcommand[Secret]):
    """`journal secret show <n>`: a secret's fields, which are filled, and the programs it may go to and those
    proposed; never a value."""

    cli_name = "secret"
    name = "show"

    def __init__(self, secrets: SecretQuery) -> None:
        self.secrets = secrets

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("n", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> Secret:
        return self.secrets.find(arguments.n)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, Secret):
            return
        heading = f"secret {value.id}: {value.title} ({value.secret_type})"
        lines = [line for line in (heading, value.brief) if line]
        for field in value.secret_fields():
            lines.append(f"  {field.name}  {field.variable}  {'filled' if field.name in value.filled else 'waiting for the user'}{', hidden' if field.hidden else ''}")
        proposed = f"; proposed: {', '.join(value.proposed)}" if value.proposed else ""
        lines.append(f"  given to: {', '.join(value.programs) or 'no program yet'}{proposed}")
        output.write("\n".join(lines), {**output.values(value), "waiting": value.is_waiting()})

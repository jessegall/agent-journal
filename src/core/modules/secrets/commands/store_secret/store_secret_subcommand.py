from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.secrets.commands.fill_secret.fill_secret import FillSecret
from core.modules.secrets.commands.support.filled_field import FilledField


class StoreSecretSubcommand(Subcommand[FillSecret, FilledField]):
    """`journal secret store <n> <field> <file>`: a value the agent made, such as a generated password, moved
    from its file into the secret; the file is deleted."""

    cli_name = "secret"
    name = "store"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("n", type=int)
        parser.add_argument("field")
        parser.add_argument("file")

    def command(self, arguments: Namespace, caller: Caller) -> FillSecret:
        return FillSecret(arguments.n, arguments.field, file=arguments.file)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, FilledField):
            output.line(f"{value.field_name} of secret {value.secret.id} stored, and {value.file} deleted")

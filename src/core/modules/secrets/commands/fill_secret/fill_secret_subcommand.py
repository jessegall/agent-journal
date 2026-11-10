from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.secrets.commands.fill_secret.fill_secret import FillSecret
from core.modules.secrets.commands.support.filled_field import FilledField


class FillSecretSubcommand(Subcommand[FillSecret, FilledField]):
    """`journal secret fill <n> <field> <value>`: the Secrets window's line for a value the user typed."""

    cli_name = "secret"
    name = "fill"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("n", type=int)
        parser.add_argument("field")
        parser.add_argument("value")

    def command(self, arguments: Namespace, caller: Caller) -> FillSecret:
        return FillSecret(arguments.n, arguments.field, value=arguments.value)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, FilledField):
            output.line(f"secret {value.secret.id} filled: {value.secret.title}")

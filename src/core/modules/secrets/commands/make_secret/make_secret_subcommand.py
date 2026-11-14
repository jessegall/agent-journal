from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.secrets.commands.make_secret.make_secret import MakeSecret
from core.modules.secrets.models.enums.secret_type import SecretType
from core.modules.secrets.models.secret import Secret


class MakeSecretSubcommand(Subcommand[MakeSecret, Secret]):
    """`journal secret make <title> [--type <type>] [--field <name>] [--brief "<how it is used>"]`."""

    cli_name = "secret"
    name = "make"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")
        parser.add_argument("--type", default=SecretType.API_KEY.value)
        parser.add_argument("--field", action="append", default=[])
        parser.add_argument("--brief", default="")

    def command(self, arguments: Namespace, caller: Caller) -> MakeSecret:
        return MakeSecret(arguments.title, arguments.brief, SecretType.lookup(arguments.type), tuple(arguments.field))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Secret):
            names = ", ".join(field.name for field in value.secret_fields())
            output.line(f"secret {value.id} made: {value.title}, waiting for the user to fill {names} on the Secrets window")

from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.secrets.commands.make_secret.make_secret import MakeSecret
from core.modules.secrets.models.enums.secret_type import SecretType
from core.modules.secrets.models.secret import Secret


class RequestSecretSubcommand(Subcommand[MakeSecret, Secret]):
    """`journal secret request <title> --why "<what for>" [--type <type>] [--field <name>] [--brief "<how it
    is used>"]`: the secret is made and the user is asked in the chat to fill it on the Secrets window."""

    cli_name = "secret"
    name = "request"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")
        parser.add_argument("--why", required=True)
        parser.add_argument("--type", default=SecretType.API_KEY.value)
        parser.add_argument("--field", action="append", default=[])
        parser.add_argument("--brief", default="")

    def command(self, arguments: Namespace, caller: Caller) -> MakeSecret:
        return MakeSecret(arguments.title, arguments.brief, SecretType.lookup(arguments.type), tuple(arguments.field), arguments.justification)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Secret):
            output.line(f"secret {value.id} asked for: the user fills it on the Secrets window")

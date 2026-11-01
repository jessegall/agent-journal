from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.secrets.commands.edit_secret import EditSecret
from core.modules.secrets.models.secret import Secret


class SecretUpdateSubcommand(Subcommand[EditSecret, Secret]):
    """`journal secret update <n> [--title "<title>"] [--brief "<how it is used>"]`."""

    cli_name = "secret"
    name = "update"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("n", type=int)
        parser.add_argument("--title", default="")
        parser.add_argument("--brief", default="")

    def command(self, arguments: Namespace, caller: Caller) -> EditSecret:
        return EditSecret(arguments.n, arguments.title, arguments.brief)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Secret):
            output.line(f"secret {value.id} updated: {value.title}")

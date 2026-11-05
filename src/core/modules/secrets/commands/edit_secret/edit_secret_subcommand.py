from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.secrets.commands.edit_secret.edit_secret import EditSecret
from core.modules.secrets.models.secret import Secret


class EditSecretSubcommand(Subcommand[EditSecret, Secret]):
    """`journal secret update <n> [--title "<title>"] [--brief "<how it is used>"]`."""

    cli_name = "secret"
    name = "update"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("n", type=int)
        parser.add_argument("--title", default="")
        parser.add_argument("--brief", default="")
        parser.add_argument("--add-field", action="append", default=[], dest="added_fields")
        parser.add_argument("--remove-field", action="append", default=[], dest="removed_fields")

    def command(self, arguments: Namespace, caller: Caller) -> EditSecret:
        return EditSecret(arguments.n, arguments.title, arguments.brief, tuple(arguments.added_fields), tuple(arguments.removed_fields))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Secret):
            output.line(f"secret {value.id} updated: {value.title}")

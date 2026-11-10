from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.secrets.commands.change_secret_deletion.change_secret_deletion import ChangeSecretDeletion
from core.modules.secrets.models.secret import Secret


class RestoreSecretSubcommand(Subcommand[ChangeSecretDeletion, Secret]):
    """`journal secret restore <n>`: a deleted secret back, with its values."""

    cli_name = "secret"
    name = "restore"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("n", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> ChangeSecretDeletion:
        return ChangeSecretDeletion(arguments.n, False)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Secret):
            output.line(f"secret {value.id} restored")

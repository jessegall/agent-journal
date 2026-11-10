from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.secrets.commands.change_secret_deletion.change_secret_deletion import ChangeSecretDeletion
from core.modules.secrets.models.secret import Secret


class DeleteSecretSubcommand(Subcommand[ChangeSecretDeletion, Secret]):
    """`journal secret delete <n>`: the secret leaves the list; its values stay for a restore."""

    cli_name = "secret"
    name = "delete"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("n", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> ChangeSecretDeletion:
        return ChangeSecretDeletion(arguments.n, True)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Secret):
            output.line(f"secret {value.id} deleted; journal secret restore {value.id} brings it back with its values")

from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.secrets.commands.delete_secret.delete_secret import DeleteSecret
from core.modules.secrets.models.secret import Secret


class DeleteSecretSubcommand(Subcommand[DeleteSecret, Secret]):
    """`journal secret delete <n>`: erases the secret and its values for good; nothing restores it."""

    cli_name = "secret"
    name = "delete"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("n", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> DeleteSecret:
        return DeleteSecret(arguments.n)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Secret):
            output.line(f"secret {value.id} erased with its values; it cannot be restored")

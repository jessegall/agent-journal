from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.ask_permission.ask_permission import AskPermission
from core.modules.drivers.models.permission_request import PermissionRequest


class AskPermissionSubcommand(Subcommand[AskPermission, PermissionRequest]):
    """`journal permission ask "<command or file>" --reason "<why>" [--person]`: asks for leave to do that one thing once."""

    cli_name = "permission"
    name = "ask"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("action")
        parser.add_argument("--reason", required=True)
        parser.add_argument("--person", action="store_true", dest="needs_person")

    def command(self, arguments: Namespace, caller: Caller) -> AskPermission:
        return AskPermission(arguments.action, arguments.reason, arguments.needs_person)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PermissionRequest):
            output.line(f"permission request {value.id}: {value.state.value}")

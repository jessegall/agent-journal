from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.allow_permission.allow_permission import AllowPermission
from core.modules.drivers.models.permission_request import PermissionRequest


class AllowPermissionSubcommand(Subcommand[AllowPermission, PermissionRequest]):
    """`journal permission allow <request>`: the main agent, or a person, answers an agent's request for leave once."""

    cli_name = "permission"
    name = "allow"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("request_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> AllowPermission:
        return AllowPermission(arguments.request_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PermissionRequest):
            output.line(f"permission request {value.id}: {value.state.value}")

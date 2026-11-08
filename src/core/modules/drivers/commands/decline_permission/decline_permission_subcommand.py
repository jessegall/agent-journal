from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.decline_permission.decline_permission import DeclinePermission
from core.modules.drivers.models.permission_request import PermissionRequest


class DeclinePermissionSubcommand(Subcommand[DeclinePermission, PermissionRequest]):
    """`journal permission decline <request>`: the main agent, or a person, answers an agent's request for
    leave once."""

    cli_name = "permission"
    name = "decline"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("request_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> DeclinePermission:
        return DeclinePermission(arguments.request_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PermissionRequest):
            output.line(f"permission request {value.id}: {value.state.value}")

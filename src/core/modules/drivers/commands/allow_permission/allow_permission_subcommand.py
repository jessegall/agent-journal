from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.modules.drivers.commands.allow_permission.allow_permission import AllowPermission
from core.modules.drivers.commands.support.change_permission_request_subcommand import ChangePermissionRequestSubcommand


class AllowPermissionSubcommand(ChangePermissionRequestSubcommand[AllowPermission]):
    """`journal permission allow <request>`: the main agent, or a user, answers an agent's request for leave once."""

    cli_name = "permission"
    name = "allow"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("request_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> AllowPermission:
        return AllowPermission(arguments.request_id)

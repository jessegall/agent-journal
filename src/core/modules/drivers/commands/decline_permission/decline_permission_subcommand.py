from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.modules.drivers.commands.decline_permission.decline_permission import DeclinePermission
from core.modules.drivers.commands.support.change_permission_request_subcommand import ChangePermissionRequestSubcommand


class DeclinePermissionSubcommand(ChangePermissionRequestSubcommand[DeclinePermission]):
    """`journal permission decline <request>`: the main agent, or a user, answers an agent's request for
    leave once."""

    cli_name = "permission"
    name = "decline"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("request_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> DeclinePermission:
        return DeclinePermission(arguments.request_id)

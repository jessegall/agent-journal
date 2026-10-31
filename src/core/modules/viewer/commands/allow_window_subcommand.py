from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.viewer.commands.allow_window import AllowWindow
from core.modules.viewer.models.window_permission import WindowPermission
from core.modules.viewer.models.enums.window_permission_type import WindowPermissionType


class AllowWindowSubcommand(Subcommand[AllowWindow, WindowPermission]):
    """`journal window allow <window> --type reads|runs`: lets the window read or run the lines it declares, for you."""

    cli_name = "window"
    name = "allow"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("window")
        parser.add_argument("--type", required=True, choices=[WindowPermissionType.READS.value, WindowPermissionType.RUNS.value])

    def command(self, arguments: Namespace, caller: Caller) -> AllowWindow:
        return AllowWindow(arguments.window, WindowPermissionType(arguments.type))

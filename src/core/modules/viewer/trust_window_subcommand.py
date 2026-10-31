from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.viewer.window_permission import WindowPermission
from core.modules.viewer.trust_window import TrustWindow


class TrustWindowSubcommand(Subcommand[TrustWindow, WindowPermission]):
    """`journal window trust <module>`: lets the module's windows run in the viewer's page, with the page's rights,
    until its code changes."""

    cli_name = "window"
    name = "trust"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("module")

    def command(self, arguments: Namespace, caller: Caller) -> TrustWindow:
        return TrustWindow(arguments.module)

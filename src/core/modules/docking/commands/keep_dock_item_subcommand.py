from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.docking.commands.keep_dock_item import KeepDockItem
from core.modules.docking.models.dock_item import DockItem


class KeepDockItemSubcommand(Subcommand[KeepDockItem, DockItem]):
    """`journal dock keep <item>`: keeps an item that would leave by itself."""

    cli_name = "dock"
    name = "keep"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("item_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> KeepDockItem:
        return KeepDockItem(arguments.item_id)

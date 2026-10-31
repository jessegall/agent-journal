from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.docking.commands.remove_dock_item import RemoveDockItem
from core.modules.docking.models.dock_item import DockItem


class RemoveDockItemSubcommand(Subcommand[RemoveDockItem, DockItem]):
    """`journal dock remove <item>`: takes an item out of the dock."""

    cli_name = "dock"
    name = "remove"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("item_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RemoveDockItem:
        return RemoveDockItem(arguments.item_id)

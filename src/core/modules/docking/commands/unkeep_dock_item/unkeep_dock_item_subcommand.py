from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.docking.commands.unkeep_dock_item.unkeep_dock_item import UnkeepDockItem
from core.modules.docking.models.dock_item import DockItem


class UnkeepDockItemSubcommand(Subcommand[UnkeepDockItem, DockItem]):
    """`journal dock unkeep <item>`: lets a kept item leave by itself again."""

    cli_name = "dock"
    name = "unkeep"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("item_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> UnkeepDockItem:
        return UnkeepDockItem(arguments.item_id)

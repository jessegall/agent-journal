from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.docking.commands.release_dock_item.release_dock_item import ReleaseDockItem
from core.modules.docking.models.dock_item import DockItem


class ReleaseDockItemSubcommand(Subcommand[ReleaseDockItem, DockItem]):
    """`journal dock unkeep <item>`: lets a kept item leave by itself again."""

    cli_name = "dock"
    name = "unkeep"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("item_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> ReleaseDockItem:
        return ReleaseDockItem(arguments.item_id)

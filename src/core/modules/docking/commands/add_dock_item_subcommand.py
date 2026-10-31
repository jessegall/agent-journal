from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.docking.commands.add_dock_item import AddDockItem
from core.modules.docking.models.dock_item import DockItem


class AddDockItemSubcommand(Subcommand[AddDockItem, DockItem]):
    """`journal dock add <type> <row model> <row>`: docks the row above the chat as an item of the type."""

    cli_name = "dock"
    name = "add"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("type")
        parser.add_argument("row_model")
        parser.add_argument("row_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> AddDockItem:
        return AddDockItem(None, arguments.type, arguments.row_model, arguments.row_id)

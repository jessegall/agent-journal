from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.library.commands.restore_library_item.restore_library_item import RestoreLibraryItem
from core.modules.library.support.item_arguments import ItemArguments
from core.modules.library.support.restored_library_item import RestoredLibraryItem


class RestoreLibraryItemSubcommand(ItemArguments, Subcommand[RestoreLibraryItem, RestoredLibraryItem]):
    """`journal library restore <type> <id> [--version n]`: brings back a removed item, or puts the text of an old
    version in again as a new version."""

    cli_name = "library"
    name = "restore"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        super().arguments(parser)
        parser.add_argument("--version", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RestoreLibraryItem:
        return RestoreLibraryItem(arguments.share, arguments.item_id, arguments.version)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RestoredLibraryItem):
            item = value.item
            text = f"is back at the text of version {value.old_version}, as version {item.version}" if value.old_version is not None else f"is back, as version {item.version}"
            output.line(f"library {item.share} {item.item_id} {text}")

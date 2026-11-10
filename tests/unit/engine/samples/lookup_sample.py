from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from tests.unit.engine.command.test_commands import MakeItem
from tests.unit.engine.model.test_model import Item


class ItemMakeOwn(Subcommand[MakeItem, Item]):
    cli_name = "item"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")

    def command(self, arguments: Namespace, caller: Caller) -> MakeItem:
        return MakeItem(title=arguments.title.title())

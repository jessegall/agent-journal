from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from tests.unit.core.base.command.test_commands import MakeItem
from tests.unit.core.base.model.test_model import Item


class ItemMakeOwn(Subcommand[MakeItem, Item]):
    cli_name = "item"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")

    def command(self, arguments: Namespace, caller: Caller) -> MakeItem:
        return MakeItem(title=arguments.title.title())

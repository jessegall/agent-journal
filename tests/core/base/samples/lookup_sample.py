from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from tests.core.base.command.test_commands import ItemMake
from tests.core.base.model.test_model import Item


class ItemMakeOwn(Subcommand[ItemMake, Item]):
    cli_noun = "item"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")

    def command(self, arguments: Namespace, caller: Caller) -> ItemMake:
        return ItemMake(title=arguments.title.title())

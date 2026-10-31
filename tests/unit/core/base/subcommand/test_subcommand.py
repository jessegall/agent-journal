from argparse import ArgumentParser, Namespace

from core.base.actor import Actor, ActorType
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from tests.unit.core.base.command.test_commands import ItemMake
from tests.unit.core.base.model.test_model import Item

CALLER = Caller(Actor(7, ActorType.AGENT), environment_id=2)


class ItemMakeSubcommand(Subcommand[ItemMake, Item]):
    cli_name = "item"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")

    def command(self, arguments: Namespace, caller: Caller) -> ItemMake:
        return ItemMake(title=arguments.title)


def test_a_subcommand_reads_its_arguments_into_a_command():
    subcommand, parser = ItemMakeSubcommand(), ArgumentParser()
    subcommand.arguments(parser)
    assert subcommand.command(parser.parse_args(["Dune"]), CALLER) == ItemMake(title="Dune")

from argparse import ArgumentParser, Namespace

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from tests.unit.core.base.command.test_commands import MakeItem
from tests.unit.core.base.model.test_model import Item

CALLER = Caller(Actor(7, ActorType.AGENT), environment_id=2)


class ItemMakeSubcommand(Subcommand[MakeItem, Item]):
    cli_name = "item"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")

    def command(self, arguments: Namespace, caller: Caller) -> MakeItem:
        return MakeItem(title=arguments.title)


def test_a_subcommand_reads_its_arguments_into_a_command():
    subcommand, parser = ItemMakeSubcommand(), ArgumentParser()
    subcommand.arguments(parser)
    assert subcommand.command(parser.parse_args(["Dune"]), CALLER) == MakeItem(title="Dune")

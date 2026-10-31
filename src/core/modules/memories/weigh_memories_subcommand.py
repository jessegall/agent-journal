from argparse import ArgumentParser, Namespace

from core.base.cli.number_list import number_list
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.memories.memory import Memory
from core.modules.memories.weigh_memories import WeighMemories


class WeighMemoriesSubcommand(Subcommand[WeighMemories, list[Memory]]):
    """`journal memory weigh 3,7,9 5,8,2`: gives each memory its own weight, or `weigh 3,7,9 5` one weight to all."""

    cli_name = "memory"
    name = "weigh"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("memory_ids", type=number_list)
        parser.add_argument("weights", type=number_list)

    def command(self, arguments: Namespace, caller: Caller) -> WeighMemories:
        return WeighMemories(arguments.memory_ids, arguments.weights)

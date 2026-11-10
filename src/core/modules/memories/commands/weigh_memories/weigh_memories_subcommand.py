from argparse import ArgumentParser, Namespace

from core.base.cli.number_list import number_list
from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from engine.types.type_guards import is_list
from core.modules.memories.models.memory import Memory
from core.base.subcommand.subcommand import Subcommand
from core.modules.memories.models.memory import Memory
from core.modules.memories.commands.weigh_memories.weigh_memories import WeighMemories


class WeighMemoriesSubcommand(Subcommand[WeighMemories, list[Memory]]):
    """`journal memory weigh 3,7,9 5,8,2`: gives each memory its own weight, or `weigh 3,7,9 5` one weight
    to all."""

    cli_name = "memory"
    name = "weigh"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("memory_ids", type=number_list)
        parser.add_argument("weights", type=number_list)

    def command(self, arguments: Namespace, caller: Caller) -> WeighMemories:
        return WeighMemories(arguments.memory_ids, arguments.weights)

    def write_output(self, value: object, output: Output) -> None:
        memories = [memory for memory in value if isinstance(memory, Memory)] if is_list(value) else []
        output.write(", ".join(f"memory {memory.id} at {memory.weight}" for memory in memories), {"rows": [{"id": memory.id, "weight": memory.weight} for memory in memories]})

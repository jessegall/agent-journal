from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.memories.models.memory import Memory
from core.modules.memories.commands.read_memory import ReadMemory


class ReadMemorySubcommand(Subcommand[ReadMemory, Memory]):
    """`journal memory read <n>`: a memory whole, then in your context until your next compaction."""

    cli_name = "memory"
    name = "read"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("memory_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> ReadMemory:
        return ReadMemory(arguments.memory_id)

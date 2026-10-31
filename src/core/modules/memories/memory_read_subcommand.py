from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.memories.memory import Memory
from core.modules.memories.memory_read import MemoryRead


class MemoryReadSubcommand(Subcommand[MemoryRead, Memory]):
    """`journal memory read <n>`: a memory whole, then in your context until your next compaction."""

    cli_name = "memory"
    name = "read"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("memory_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> MemoryRead:
        return MemoryRead(arguments.memory_id)

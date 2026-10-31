from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.memories.memory_mark import MemoryMark
from core.modules.memories.skip_memory_mark import SkipMemoryMark


class SkipMemoryMarkSubcommand(Subcommand[SkipMemoryMark, MemoryMark]):
    """`journal memory skip "<why>"`: closes your open memory mark, saying why nothing needs keeping."""

    cli_name = "memory"
    name = "skip"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("reason")

    def command(self, arguments: Namespace, caller: Caller) -> SkipMemoryMark:
        return SkipMemoryMark(arguments.reason)

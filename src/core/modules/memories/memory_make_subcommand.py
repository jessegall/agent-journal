from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.base.timestamp import Timestamp
from core.modules.memories.memory import Memory
from core.modules.memories.memory_make import MemoryMake


class MemoryMakeSubcommand(Subcommand[MemoryMake, Memory]):
    """`journal memory make "<text>" --type <type> [--weight 7] [--keywords a,b] [--task 12] [--due <time>] [--project]
    [--own]`: a memory for your environment, the whole project or yourself alone."""

    cli_name = "memory"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")
        parser.add_argument("--type", required=True)
        parser.add_argument("--weight", type=int)
        parser.add_argument("--keywords", default="")
        parser.add_argument("--task", type=int)
        parser.add_argument("--due", type=Timestamp.parsed)
        parser.add_argument("--project", action="store_true")
        parser.add_argument("--own", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> MemoryMake:
        keywords = tuple(word.strip().lower() for word in arguments.keywords.split(",") if word.strip())
        return MemoryMake(arguments.text, arguments.type, arguments.weight, keywords, arguments.task, arguments.due, arguments.project, arguments.own)

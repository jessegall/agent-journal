from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.memories.models.memory import Memory
from core.modules.memories.commands.make_memory.make_memory import MakeMemory


class MakeMemorySubcommand(Subcommand[MakeMemory, Memory]):
    """`journal memory make "<text>"`, with a weight, keywords and a task if wanted."""

    cli_name = "memory"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")
        parser.add_argument("--weight", type=int)
        parser.add_argument("--keywords", default="")
        parser.add_argument("--task", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> MakeMemory:
        keywords = tuple(word.strip().lower() for word in arguments.keywords.split(",") if word.strip())
        return MakeMemory(arguments.text, arguments.weight, keywords, arguments.task)

from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.memories.models.memory import Memory
from core.modules.memories.commands.make_memory.make_memory import MakeMemory


class MakeMemorySubcommand(Subcommand[MakeMemory, Memory]):
    """`journal memory make "<text>" --type <type>`, with a weight, keywords and a task if
    wanted: a memory for your environment, or with --own for yourself alone."""

    cli_name = "memory"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")
        parser.add_argument("--type", required=True)
        parser.add_argument("--weight", type=int)
        parser.add_argument("--keywords", default="")
        parser.add_argument("--task", type=int)
        parser.add_argument("--own", action="store_true", dest="personal")

    def command(self, arguments: Namespace, caller: Caller) -> MakeMemory:
        keywords = tuple(word.strip().lower() for word in arguments.keywords.split(",") if word.strip())
        return MakeMemory(arguments.text, arguments.type, arguments.weight, keywords, arguments.task, arguments.personal)

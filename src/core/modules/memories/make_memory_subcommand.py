from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.base.timestamp import Timestamp
from core.modules.memories.memory import Memory
from core.modules.memories.make_memory import MakeMemory


class MakeMemorySubcommand(Subcommand[MakeMemory, Memory]):
    """`journal memory make "<text>" --type <type>`, with a weight, keywords, a task and a due time if wanted: a
    memory for your environment, with --project for the whole project, or with --own for yourself alone."""

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
        parser.add_argument("--own", action="store_true", dest="personal")

    def command(self, arguments: Namespace, caller: Caller) -> MakeMemory:
        keywords = tuple(word.strip().lower() for word in arguments.keywords.split(",") if word.strip())
        return MakeMemory(arguments.text, arguments.type, arguments.weight, keywords, arguments.task, arguments.due, arguments.project, arguments.personal)

from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.support.execution_class_preview import ExecutionClassPreview

NO_MATCH = "no recent line would have matched"


class PreviewExecutionClassSubcommand(ReadSubcommand[str]):
    """`journal queue-class preview --pattern <pattern> | --plugin <name>`: the five newest lines a class would have matched."""

    cli_name = "queue-class"
    name = "preview"

    def __init__(self, preview: ExecutionClassPreview) -> None:
        self.preview = preview

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--pattern", default="", help="the line pattern of the class, as the class table matches it")
        parser.add_argument("--plugin", default="", help="the plugin whose runs the class takes")

    def read(self, arguments: Namespace, caller: Caller) -> str:
        if not arguments.pattern and not arguments.plugin:
            raise Refusal("a preview needs a line pattern or a plugin", "add --pattern or --plugin")
        lines = self.preview.matched(arguments.pattern, arguments.plugin)
        return "\n".join([f"{len(lines)} recent lines would have matched:", *lines]) if lines else NO_MATCH

from argparse import ArgumentParser, Namespace
from dataclasses import dataclass

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.support.execution_class_preview import ExecutionClassPreview

NO_MATCH = "no recent line would have matched"


@dataclass(frozen=True)
class ClassPreview:
    """The newest lines a class would have matched, as lines a person reads and as JSON."""

    matched: tuple[str, ...]

    def lines(self) -> list[str]:
        return [f"{len(self.matched)} recent lines would have matched:", *self.matched] if self.matched else [NO_MATCH]

    def json(self) -> dict[str, object]:
        return {"lines": list(self.matched)}


class PreviewExecutionClassSubcommand(ReadSubcommand[ClassPreview]):
    """`journal queue-class preview --pattern <pattern> | --plugin <name>`: the five newest lines a class would have matched."""

    cli_name = "queue-class"
    name = "preview"

    def __init__(self, preview: ExecutionClassPreview) -> None:
        self.preview = preview

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--pattern", default="", help="the line pattern of the class, as the class table matches it")
        parser.add_argument("--plugin", default="", help="the plugin whose runs the class takes")

    def read(self, arguments: Namespace, caller: Caller) -> ClassPreview:
        if not arguments.pattern and not arguments.plugin:
            raise Refusal("a preview needs a line pattern or a plugin", "add --pattern or --plugin")
        return ClassPreview(tuple(self.preview.matched(arguments.pattern, arguments.plugin)))

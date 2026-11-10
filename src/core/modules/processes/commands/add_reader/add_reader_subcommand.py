from argparse import ArgumentParser, Namespace

from engine.actor.actor import CORE_ACTOR_ID
from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.add_reader.add_reader import AddReader
from core.modules.processes.models.reader import Reader
from engine.subcommand.output import Output
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.reader_selection import ReaderSelection


class AddReaderSubcommand(Subcommand[AddReader, Reader]):
    """`journal reader add <name> --commands <pattern> --lines <pattern>|--script <path>`: adds a reader of
    outputs, or changes the fields given of the one with that name."""

    cli_name = "reader"
    name = "add"
    outward = True

    def __init__(self, requests: ReaderRequestQuery) -> None:
        self.requests = requests

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("reader_name")
        for flag in ("commands", "lines", "script", "progress", "finished", "failed", "summary", "topic", "title", "subject", "step", "count", "count-command"):
            parser.add_argument(f"--{flag}", default="")

    def command(self, arguments: Namespace, caller: Caller) -> AddReader:
        return AddReader(arguments.reader_name, arguments.commands, arguments.lines, arguments.script, arguments.progress, arguments.finished, arguments.failed,
                         arguments.summary, arguments.topic, arguments.title, arguments.subject, arguments.step, arguments.count, arguments.count_command)

    def write_output(self, value: object, output: Output) -> None:
        super().write_output(value, output)
        if not isinstance(value, Reader) or output.json_output:
            return
        if value.creator_id == CORE_ACTOR_ID:
            output.line("This is a stock reader. Apply the same fix to src/core/modules/processes/support/stock_reader.py, or file a task for it.")
        for request in self.requests.open_rows():
            if not ReaderSelection.reads_command(value, request.command, request.category):
                output.line(f"reader {value.name} does not read {request.command}; reader request {request.id} stays open")

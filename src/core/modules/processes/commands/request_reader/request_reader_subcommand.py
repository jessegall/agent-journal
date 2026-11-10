from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.request_reader.request_reader import RequestReader
from core.modules.processes.models.reader_request import ReaderRequest


class RequestReaderSubcommand(Subcommand[RequestReader, ReaderRequest]):
    """`journal output ask-reader <n>`: opens a reader request for the command of an output that has no reader
    and tells the agent that ran it, in the chat, from the person."""

    cli_name = "output"
    name = "ask-reader"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RequestReader:
        return RequestReader(arguments.process_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ReaderRequest):
            output.line(f"reader request {value.id} is open for {value.command}")

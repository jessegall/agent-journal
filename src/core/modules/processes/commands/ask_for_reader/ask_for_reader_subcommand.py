from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.ask_for_reader.ask_for_reader import AskForReader
from core.modules.processes.models.reader_request import ReaderRequest


class AskForReaderSubcommand(Subcommand[AskForReader, ReaderRequest]):
    """`journal output ask-reader <n>`: opens a reader request for the command of an output that has no reader and tells the agent that ran it,
    in the chat, from the person."""

    cli_name = "output"
    name = "ask-reader"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> AskForReader:
        return AskForReader(arguments.process_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ReaderRequest):
            output.line(f"reader request {value.id} is open for {value.command}")

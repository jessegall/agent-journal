from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.messages.commands.choose_work_source.choose_work_source import ChooseWorkSource
from core.modules.messages.models.message_work_source import MessageWorkSource


class ChooseWorkSourceSubcommand(Subcommand[ChooseWorkSource, MessageWorkSource]):
    """Explicitly switches the request used for later work."""

    cli_name = "message"
    name = "work-from"
    help = "Select an addressed person request, including an older read request. Routine reads preserve it; reply and work-from switch it."

    def __init__(self, numbers: RowNumbers) -> None:
        self.numbers = numbers

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("message_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> ChooseWorkSource:
        return ChooseWorkSource(arguments.message_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, MessageWorkSource):
            output.write(f"request selection: message:{value.message_id}\nselecting actor: agent:{self.numbers.number(AGENT_MODEL_NAME, value.agent_id)}\n"
                         f"environment: {value.environment_id}\norigin: {value.origin}", output.values(value))

from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.agent_number import AgentNumber
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.restore_refusal_skip.restore_refusal_skip import RestoreRefusalSkip
from core.modules.drivers.models.refusal_skip import RefusalSkip


class RestoreRefusalSkipSubcommand(Subcommand[RestoreRefusalSkip, RefusalSkip]):
    """`journal refusal restore <agent>`: gives an agent its skip back after it lost it."""

    cli_name = "refusal"
    name = "restore"
    outward = True

    def __init__(self, numbers: RowNumbers) -> None:
        self.numbers = numbers

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=AgentNumber)

    def command(self, arguments: Namespace, caller: Caller) -> RestoreRefusalSkip:
        return RestoreRefusalSkip(arguments.agent_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RefusalSkip):
            output.line(f"agent:{self.numbers.number(AGENT_MODEL_NAME, value.session_agent_id)} has its skip back")

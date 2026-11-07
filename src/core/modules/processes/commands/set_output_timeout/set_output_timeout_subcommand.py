from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.duration import Duration
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.set_output_timeout.set_output_timeout import SetOutputTimeout
from core.modules.processes.models.process import Process


class SetOutputTimeoutSubcommand(Subcommand[SetOutputTimeout, Process]):
    """Sets an output's timeout with a duration such as 30s, 5m or 2h."""

    cli_name = "output"
    name = "timeout"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)
        parser.add_argument("duration", type=Duration.parse)

    def command(self, arguments: Namespace, caller: Caller) -> SetOutputTimeout:
        return SetOutputTimeout(arguments.process_id, arguments.duration)

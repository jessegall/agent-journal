from engine.cli.agent_id import AgentId
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.restore_refusal_skip.restore_refusal_skip import RestoreRefusalSkip
from core.modules.drivers.models.driver_grant import DriverGrant


class RestoreRefusalSkipSubcommand(Subcommand[RestoreRefusalSkip, DriverGrant]):
    """`journal refusal restore <agent>`: gives an agent its skip back after it lost it."""

    cli_name = "refusal"
    name = "restore"
    external = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=AgentId)

    def command(self, arguments: Namespace, caller: Caller) -> RestoreRefusalSkip:
        return RestoreRefusalSkip(arguments.agent_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, DriverGrant):
            output.line(f"agent:{value.session_agent_id} has its skip back")

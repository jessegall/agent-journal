from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.helpers.commands.end_provider_outages.end_provider_outages import EndProviderOutages


class EndProviderOutagesSubcommand(Subcommand[EndProviderOutages, None]):
    """Ends a program's current outages and preserves the rows."""

    cli_name = "provider-outage"
    name = "end"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("program")

    def command(self, arguments: Namespace, caller: Caller) -> EndProviderOutages:
        return EndProviderOutages(arguments.program)

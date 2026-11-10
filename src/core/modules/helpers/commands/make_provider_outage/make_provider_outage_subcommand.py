from argparse import ArgumentParser

from engine.cli.make_subcommand import MakeSubcommand
from core.base.model.table import Table
from engine.time.timestamp import Timestamp
from core.modules.helpers.models.provider_outage import ProviderOutage
from core.modules.helpers.commands.make_provider_outage.make_provider_outage import MakeProviderOutage


class MakeProviderOutageSubcommand(MakeSubcommand[ProviderOutage]):
    """Creates a program outage with an explicit end time."""

    cli_name = "provider-outage"
    name = "make"

    def __init__(self) -> None:
        super().__init__(Table.build(ProviderOutage))
        self.command_class = MakeProviderOutage

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("program")
        parser.add_argument("reason")
        parser.add_argument("--ends-at", type=Timestamp.parsed, required=True)

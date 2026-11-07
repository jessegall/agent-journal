from argparse import ArgumentParser

from core.base.cli.make_subcommand import MakeSubcommand
from core.base.model.table import Table
from core.base.timestamp import Timestamp
from core.modules.helpers.models.provider_outage import ProviderOutage


class MakeProviderOutageSubcommand(MakeSubcommand[ProviderOutage]):
    """Creates a program outage with an explicit end time."""

    cli_name = "provider-outage"
    name = "make"

    def __init__(self) -> None:
        super().__init__(Table.build(ProviderOutage))

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("program")
        parser.add_argument("reason")
        parser.add_argument("--ends-at", type=Timestamp.parsed, required=True)

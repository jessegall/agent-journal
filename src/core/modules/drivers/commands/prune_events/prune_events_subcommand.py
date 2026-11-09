from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.prune_events.prune_events import PruneEvents


class PruneEventsSubcommand(Subcommand[PruneEvents, int]):
    """`journal event prune`: deletes one batch of the logged changes of short-lived rows."""

    cli_name = "event"
    name = "prune"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        pass

    def command(self, arguments: Namespace, caller: Caller) -> PruneEvents:
        return PruneEvents()

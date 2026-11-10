from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.prune_hook_calls.prune_hook_calls import PruneHookCalls


class PruneHookCallsSubcommand(Subcommand[PruneHookCalls, int]):
    """`journal hook-call prune`: deletes the hook calls older than drivers.hook-call-days, with the lines
    they gave."""

    cli_name = "hook-call"
    name = "prune"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        pass

    def command(self, arguments: Namespace, caller: Caller) -> PruneHookCalls:
        return PruneHookCalls()

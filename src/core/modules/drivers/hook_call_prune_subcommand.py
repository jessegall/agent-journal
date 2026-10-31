from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.hook_call_prune import HookCallPrune


class HookCallPruneSubcommand(Subcommand[HookCallPrune, int]):
    """`journal hook-call prune`: deletes the hook calls older than drivers.hook-call-days, with the lines they gave."""

    cli_name = "hook-call"
    name = "prune"

    def arguments(self, parser: ArgumentParser) -> None:
        pass

    def command(self, arguments: Namespace, caller: Caller) -> HookCallPrune:
        return HookCallPrune()

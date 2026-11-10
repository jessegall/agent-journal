from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.developer.commands.reset_hook_numbers.reset_hook_numbers import ResetHookNumbers


class ResetHookNumbersSubcommand(Subcommand[ResetHookNumbers, None]):
    """`journal developer reset-numbers`: starts the counts of what hooks cost again."""

    cli_name = "developer"
    name = "reset-numbers"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> ResetHookNumbers:
        return ResetHookNumbers()

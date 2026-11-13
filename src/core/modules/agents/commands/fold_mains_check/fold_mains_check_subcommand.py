from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.agents.commands.fold_mains_check.fold_mains_check import FoldMainsCheck


class FoldMainsCheckSubcommand(Subcommand[FoldMainsCheck, str]):
    """`journal agent fold-mains --check`: folds the older main agent rows on a copy of the database and files a report."""

    cli_name = "agent"
    name = "fold-mains"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--check", action="store_true", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> FoldMainsCheck:
        return FoldMainsCheck()

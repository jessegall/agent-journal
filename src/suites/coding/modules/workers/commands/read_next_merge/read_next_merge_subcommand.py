from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.read_next_merge.read_next_merge import ReadNextMerge


class ReadNextMergeSubcommand(Subcommand[ReadNextMerge, str]):
    """`journal merger next`: the next worker waiting for its merge, with its briefs, proofs and log lines."""

    cli_name = "merger"
    name = "next"

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> ReadNextMerge:
        return ReadNextMerge(caller.process_id, arguments.json)

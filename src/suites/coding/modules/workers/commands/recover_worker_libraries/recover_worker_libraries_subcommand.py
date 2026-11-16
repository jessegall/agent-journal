from engine.cli.agent_id import AgentId
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.recover_worker_libraries.recover_worker_libraries import RecoverWorkerLibraries


class RecoverWorkerLibrariesSubcommand(Subcommand[RecoverWorkerLibraries, str]):
    """`journal merger repair <worker>`: links the libraries missing from a worker's worktree."""

    cli_name = "merger"
    name = "repair"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=AgentId)

    def command(self, arguments: Namespace, caller: Caller) -> RecoverWorkerLibraries:
        return RecoverWorkerLibraries(arguments.worker_id)

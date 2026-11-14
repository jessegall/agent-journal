from argparse import Namespace

from engine.caller.caller import Caller
from engine.command.command import Command
from engine.errors.refusal import Refusal
from suites.coding.modules.workers.commands.commit_worker_work.commit_worker_work_subcommand import CommitWorkerWorkSubcommand


class DeliverWorkerWorkSubcommand(CommitWorkerWorkSubcommand):
    """`journal worker deliver`: the name `journal worker commit` had. It takes the flags of the commit, does
    nothing and says which command took its place."""

    name = "deliver"

    def command(self, arguments: Namespace, caller: Caller) -> Command[object]:
        raise Refusal("journal worker deliver is gone", "use journal worker commit")

from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.prepare_worktree import PrepareWorktree


class PrepareWorktreeSubcommand(Subcommand[PrepareWorktree, None]):
    """`journal worktree prepare <folder> <source> <environment>`: the launcher's order for a freshly cut launch worktree."""

    cli_name = "worktree"
    name = "prepare"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("folder")
        parser.add_argument("source")
        parser.add_argument("environment")
        parser.add_argument("--library-link", action="append", default=[], help="a folder of the source to link into the worktree as well")
        parser.add_argument("--library-copy", action="append", default=[], help="a folder of the source to copy into the worktree as well")

    def command(self, arguments: Namespace, caller: Caller) -> PrepareWorktree:
        return PrepareWorktree(arguments.folder, arguments.source, arguments.environment, tuple(arguments.library_link), tuple(arguments.library_copy))

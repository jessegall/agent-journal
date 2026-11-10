from argparse import Namespace

from engine.caller.caller import Caller
from suites.coding.commands.support.git_page_subcommand import GitPageSubcommand
from suites.coding.support.git_rows import GitRows


class GitOverviewBranchesSubcommand(GitPageSubcommand):
    """`journal git-overview branches`: the branches, newest first, with how far each is from the base branch.
    """

    row_line = "{name}"
    empty_line = "no branches"

    name = "branches"

    def read(self, arguments: Namespace, caller: Caller) -> GitRows:
        return self.git.branches(arguments.skip, arguments.limit)

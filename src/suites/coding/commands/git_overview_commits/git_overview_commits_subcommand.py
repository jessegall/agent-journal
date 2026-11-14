from argparse import Namespace

from engine.caller.caller import Caller
from suites.coding.commands.support.git_page_subcommand import GitPageSubcommand
from suites.coding.support.git_rows import GitRows


class GitOverviewCommitsSubcommand(GitPageSubcommand):
    """`journal git-overview commits`: the recent commits of the current branch."""

    row_line = "{subject}"
    empty_line = "no commits"

    name = "commits"

    def read(self, arguments: Namespace, caller: Caller) -> GitRows:
        return self.git.commits(arguments.skip, arguments.limit)

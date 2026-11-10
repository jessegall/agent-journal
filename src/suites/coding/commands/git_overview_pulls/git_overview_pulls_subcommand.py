from argparse import Namespace

from engine.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from suites.coding.support.git_pull_rows import GitPullRows
from suites.coding.support.project_git import ProjectGit


class GitOverviewPullsSubcommand(ReadSubcommand[GitPullRows]):
    """`journal git-overview pulls`: the open pull requests, read through the gh program."""

    row_line = "{title}"
    empty_line = "no open pull requests"

    cli_name = "git-overview"
    name = "pulls"

    def __init__(self, git: ProjectGit) -> None:
        self.git = git


    def read(self, arguments: Namespace, caller: Caller) -> GitPullRows:
        return self.git.pulls()

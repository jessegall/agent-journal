from argparse import Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.overview_command import OverviewCommand
from engine.subcommand.read_subcommand import ReadSubcommand
from suites.coding.support.project_git import ProjectGit


class GitOverviewCurrentSubcommand(OverviewCommand, ReadSubcommand[str]):
    """`journal git-overview current`: the branch the environment's checkout is on."""

    cli_name = "git-overview"
    name = "current"

    def __init__(self, git: ProjectGit) -> None:
        self.git = git

    def read(self, arguments: Namespace, caller: Caller) -> str:
        return self.git.git_output("branch", "--show-current").strip()

    def write_output(self, value: object, output: Output) -> None:
        output.write(str(value), {"branch": value})
